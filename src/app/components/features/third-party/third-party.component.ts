import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import { MapDataService } from 'src/app/services/map-data.service';
import { QueryService } from 'src/app/services/query.service';
import { ThirdPartyService } from 'src/app/services/third-party.service';
import { ModalComponent } from '../../ui/modal/modal.component';
import { thirdPartyConfig } from './third-party.config';
import { popups } from 'src/app/config';
import * as query from '@arcgis/core/rest/query';
import { AlertifyService } from 'src/app/services/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-third-party',
  templateUrl: './third-party.component.html',
  styleUrls: ['./third-party.component.css']
})
export class ThirdPartyComponent implements OnInit {
  public fields: string[] = [];
  @ViewChild('featureSelect') featureSelect!: ElementRef;
  filterForm!: FormGroup;
  public isFeatureTableVisible: boolean = false;
  @ViewChild('featureTableNode') featureTableNode!: ElementRef;
  public featureTable!: FeatureTable;
  public columnTemplates: any[] = [];
  public activeClauses: string[] = [];
  public features!: string[];
  public displayAutocomplete: boolean = false;
  public autoCompleteOptions: string[] = [];
  public selectedField!: string;
  condition = new FormControl();

  constructor(public mapDataService: MapDataService, public thirdPartyService: ThirdPartyService,
    public formBuilder: FormBuilder, public matDialog: MatDialog, public queryService: QueryService, public alertifyService: AlertifyService) { }

  ngOnInit() {
    this.features = thirdPartyConfig.features;
    this.initializeForm();
    this.queryData(this.features[0]);
  }

  addData(): void {
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    const layerId = thirdPartyConfig.layerId + selectedFeature.toLowerCase();
    let expression: string | undefined = this.constructExpression(layerId);

    if (expression == " = ''") {
      expression = undefined;
    }

    this.mapDataService.addLayerToMap('map-image', thirdPartyConfig.url + selectedFeature + '/MapServer'
    , layerId
    , true
    , expression
    , thirdPartyConfig.layerTitle + selectedFeature.replace(/_/gi, ' '),
      popups.rextag_pipes);
      this.resetFilterForm();
      this.queryData();
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      field: ['', Validators.required],
      comparator: ['=', Validators.required],
      condition: ['', Validators.required]
    });
  }

  clearActiveClauses(): void {
    this.activeClauses = [];
  }

  resetFilterForm() {
    let field;
    this.fields = [];
    (this.selectedField) ? field = this.selectedField : field = '';
    this.filterForm.setValue({field: field, comparator: '=', condition: ''});
  }

  queryData(feature?:string): void {
    this.clearActiveClauses();
    this.resetFilterForm();
    (!feature) ? feature = this.featureSelect.nativeElement.value : feature;
    this.queryService.queryForFields(thirdPartyConfig.queryURL + feature + '/MapServer/0', "1=1").subscribe(result => {

      let attributes = result.features[0].attributes;

      for (let [field, value] of Object.entries(attributes)) {
        this.fields.push(field);
        this.columnTemplates.push({fieldName: field});
      }

      const layerId = thirdPartyConfig.layerId + feature?.toLowerCase();
      const layer = this.mapDataService.getFeatureLayerById(layerId);

      if (layer) {
        let expression = this.getLayerExpression(layerId);
        if (expression) {
          expression.split(' AND ').forEach(clause => this.activeClauses.push(clause));
        }
      }
    });
  }

  getOptions(): void {

    this.autoCompleteOptions = [];
    const field = this.filterForm.value.field;
    this.selectedField = field;
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    let expression = "1=1";
    if (this.activeClauses.length > 0) {
      expression = this.activeClauses.join(' AND ');
    }

    if (thirdPartyConfig.autofillFields.includes(field)) {
      this.displayAutocomplete = true;
      let queryURL = environment.baseUrl + 'Rextag/' + selectedFeature + '/MapServer/0';
      query.executeQueryJSON(queryURL, {
        returnDistinctValues: true,
        outFields: [field],
        where: expression,  //consider this
        orderByFields: [field],
        returnGeometry: false,
        maxRecordCountFactor: 5,
        returnExceededLimitFeatures: true
      }).then(result => {
        let features = result.features;
        features.forEach(feature => {
          this.autoCompleteOptions.push(feature.attributes[field]);
        });
      }, (error) => {
        this.alertifyService.error(error.message);
        console.log(error);
      });
    } else {
      this.displayAutocomplete = false;
      return;
    }
  }

  toggleFeatureTableVisibility(): void {
    this.isFeatureTableVisible = !this.isFeatureTableVisible;
    if (this.isFeatureTableVisible)  {
      setTimeout(() => {
        this.initializeFeatureTable();
      }, 500);
    } else {
      this.featureTable.destroy();
    }
  }

  initializeFeatureTable(): void {
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    const layerId: string = thirdPartyConfig.layerId + selectedFeature.toLowerCase();
    const featureLayer = this.mapDataService.getFeatureLayerById(layerId);
    this.featureTable = new FeatureTable({
      view: this.mapDataService.getView(),
      layer: featureLayer,
      visibleElements: {
        // Autocast to VisibleElements
        menuItems: {
          clearSelection: true,
          refreshData: true,
          toggleColumns: true,
          selectedRecordsShowAllToggle: true,
          // selectedRecordsShowSelectedToggle: true,
          zoomToSelection: true
        }
      },
      tableTemplate: {
        // Autocast to TableTemplate
        columnTemplates: this.columnTemplates as any
      },
      container: this.featureTableNode.nativeElement
    });
  }

  constructExpression(layerId: string): string {
    let field = this.filterForm.value.field;
    let comparator = this.filterForm.value.comparator;
    let condition = this.filterForm.value.condition;
    let currentExpression = (this.mapDataService.getLayerById(layerId)) ? this.getLayerExpression(layerId) : null;
    let expression;

    console.log(condition);
    if (!thirdPartyConfig.intFields.includes(field)) {
      (comparator == 'LIKE') ? condition = `'%${condition}%'` : condition = `'${condition}'`;
    }

    expression = `${field} ${comparator} ${condition}`;

    if (condition != "''" ){
      if (condition.length > 1) {
        let conditionArr: string[] = [];
        this.filterForm.value.condition.forEach((x: string) => {
          conditionArr.push(`'${x}'`);
        });
        expression = `${field} IN (${conditionArr.join(', ')})`;
      }
    }



    if (currentExpression) {
      expression = currentExpression + " AND " + expression;
    }
    if (field.length > 0)
      this.activeClauses.push(expression);

    return expression;
  }

  filterData() {
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    const layerId: string = thirdPartyConfig.layerId + selectedFeature.toLowerCase();
    if (!this.mapDataService.getFeatureLayerById(layerId)) {
      return;
    }

    if (this.filterForm.value.field == '') {
      return;
    }

    this.mapDataService.changeMapImageLayerDefinitionExpression(layerId, this.constructExpression(layerId));
    this.resetFilterForm();
  }

  getLayerExpression(id: string): string {
    let layer = this.mapDataService.getLayerById(id);
    let expression: string = '';
    if (layer.type == 'feature') {
      expression = this.mapDataService.getFeatureLayerById(id).definitionExpression;
    } else if (layer.type == 'map-image') {
      let mapImageLayer = this.mapDataService.getMapImageLayerById(id);
      mapImageLayer.sublayers.forEach(sublayer => {
        expression = sublayer.definitionExpression;
      });
    }
    return expression;
  }

  clearFilters() {
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    const layerId: string = thirdPartyConfig.layerId + selectedFeature.toLowerCase();
    this.clearActiveClauses();
    this.mapDataService.changeMapImageLayerDefinitionExpression(layerId, '');
  }

  clearFilter(clause: any) {
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    const layerId: string = thirdPartyConfig.layerId + selectedFeature.toLowerCase();
    let index = this.activeClauses.indexOf(clause);
    this.activeClauses.splice(index, 1);
    let newExpression = this.activeClauses.join(' AND ');
    this.mapDataService.changeLayerDefinitionExpression(layerId, newExpression);
    this.resetFilterForm();
  }

  addAsNewLayer(): void {
    let selectedFeature: string = this.featureSelect.nativeElement.value;
    const layerId: string = thirdPartyConfig.layerId + selectedFeature.toLowerCase();

   if (this.activeClauses.length > 0) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    dialogConfig.data = {
      name: 'add-as-new',
      expression: this.getLayerExpression(layerId),
      parentId: layerId,
      url: thirdPartyConfig.url + selectedFeature + '/MapServer'
    };

    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
    modalDialog.updateSize('0px', '0px');

    modalDialog.afterClosed().subscribe(data => {
      if (!data) {
        this.clearActiveClauses();
      }
    });

   }
  }

  formatFeatureName(value: string): string {
    return value.replace(/_/gi, ' ');
  }


}
