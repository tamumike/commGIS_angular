import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapDataService } from 'src/app/services/map-data.service';
import { PanelService } from 'src/app/services/panel.service';
import { WidgetItemComponent } from '../../ui/widget-item/widget-item.component';
import { acreageConfig } from './acreage.config';
import WebMap from '@arcgis/core/WebMap';
import { ContractsDataService } from 'src/app/services/contracts-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../../ui/modal/modal.component';
import { popups } from 'src/app/config';
import * as query from '@arcgis/core/rest/query';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-acreage',
  templateUrl: './acreage.component.html',
  styleUrls: ['./acreage.component.css']
})
export class AcreageComponent extends WidgetItemComponent implements OnInit {
  public webmap!: WebMap;
  public fields: string[] = [];
  filterForm!: FormGroup;
  public isFeatureTableVisible: boolean = false;
  @ViewChild('featureTableNode') featureTableNode!: ElementRef;
  public featureTable!: FeatureTable;
  public columnTemplates: any[] = [];
  public defExpressionObs!: string;
  public activeClauses: string[] = [];
  public displayAutocomplete: boolean = false;
  public autoCompleteOptions: string[] = [];

  public featureLayer: FeatureLayer = new FeatureLayer({
    url: acreageConfig.url,
    id: acreageConfig.layerId,
    title: acreageConfig.layerId
  });

  constructor(public _panelService: PanelService, public _router: Router, public _mapDataService: MapDataService,
    public _contractsDataService: ContractsDataService, public formBuilder: FormBuilder, public matDialog: MatDialog,
    public alertifyService: AlertifyService) {
    super(_panelService, _router, _mapDataService);
  }

  override ngOnInit(): void {
    // get fields for contracts filters
    this.webmap = this.mapDataService.getWebMap();
    this._contractsDataService.queryForContractsFields().subscribe(result => {
      let attributes = result.features[0].attributes;
      for (let [field, value] of Object.entries(attributes)) {
        this.fields.push(field);
        this.columnTemplates.push({fieldName: field});
      }
    });

    this._mapDataService.getEmitAreaSelectEvent().subscribe(response => {
      this.checkDefinitionExpression();
    });

    this.initializeForm();
    this.checkDefinitionExpression();
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      field: ['', Validators.required],
      comparator: ['=', Validators.required],
      condition: ['', Validators.required]
    });
  }

  resetFilterForm() {
    this.filterForm.setValue({field: '', comparator: '=', condition: ''});
  }

  checkDefinitionExpression() {
    let mlayer = this._mapDataService.getLayerById(acreageConfig.layerId);
    if (mlayer) {
      if (mlayer.type == 'feature') {
        const layer = this._mapDataService.getFeatureLayerById(acreageConfig.layerId);
        if (layer.definitionExpression) {
          this.clearActiveClauses();
          layer.definitionExpression.split(' AND ').forEach(clause => {
            this.activeClauses.push(clause);
          });
        }
      } else if (mlayer.type == 'map-image') {
        const layer = this._mapDataService.getMapImageLayerById(acreageConfig.layerId);
        layer.sublayers.forEach(sublayer => {
          if (sublayer.definitionExpression) {
            this.clearActiveClauses();
            sublayer.definitionExpression.split(' AND ').forEach(clause => {
              this.activeClauses.push(clause);
            })
          }
        });

      }
    }
    if (this._mapDataService.getFeatureLayerById(acreageConfig.layerId)) {

    }
  }

    constructExpression(layerId: string): string {
    let field = this.filterForm.value.field;
    let comparator = this.filterForm.value.comparator;
    let condition = this.filterForm.value.condition;
    let currentExpression = (this.mapDataService.getLayerById(layerId)) ? this.getLayerExpression() : null;
    let expression;

    if (!acreageConfig.intFields.includes(field)) {
      (comparator == 'LIKE') ? condition = `'%${condition}%'` : condition = `'${condition}'`;
    }

    expression = `${field} ${comparator} ${condition}`;

    if (currentExpression) {
      expression = currentExpression + " AND " + expression;
    }

    if (field.length > 0)
      this.activeClauses.push(expression);

    return expression;
  }

  addData(): void {
    let expression: string | undefined = this.constructExpression(acreageConfig.layerId);
    if (!this._mapDataService.getFeatureLayerById(acreageConfig.layerId)) {

      if (expression == " = ''") {
        expression = undefined;
      }

      this._mapDataService.addLayerToMap('map-image'
      , acreageConfig.url
      , acreageConfig.layerId
      , true
      , expression
      , acreageConfig.layerTitle
      , popups.contracts);
      this.resetFilterForm();
    }
  }

  clearActiveClauses(): void {
    this.activeClauses = [];
  }

  getOptions(): void {

    this.autoCompleteOptions = [];
    const field = this.filterForm.value.field;
    let expression = "1=1";
    if (this.activeClauses.length > 0) {
      expression = this.activeClauses.join(' AND ');
    }

    if (acreageConfig.autofillFields.includes(field)) {
      this.displayAutocomplete = true;
      query.executeQueryJSON(acreageConfig.queryURL, {
        returnDistinctValues: true,
        outFields: [field],
        where: expression,  //consider this
        orderByFields: [field],
        returnGeometry: false
      }).then(result => {
        let features = result.features;
        features.forEach(feature => {
          this.autoCompleteOptions.push(feature.attributes[field]);
        });
      }, (error) => {
        this.alertifyService.error(error.message);
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
    const featureLayer = this.mapDataService.getFeatureLayerById(acreageConfig.layerId);
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

  filterData() {
    if (!this._mapDataService.getFeatureLayerById(acreageConfig.layerId)) {
      return;
    }
    let field = this.filterForm.value.field;
    let comparator = this.filterForm.value.comparator;
    let condition = this.filterForm.value.condition.toUpperCase();
    let currentExpression = this.getLayerExpression();
    let expression;
    if (condition.length > 0) {

      if (!acreageConfig.intFields.includes(field)) {
        (comparator == 'LIKE') ? condition = `'%${condition}%'` : condition = `'${condition}'`;
      }

      expression = `${field} ${comparator} ${condition}`;
      this.activeClauses.push(expression);
      if (currentExpression) {
        expression = currentExpression + " AND " + expression;
      }

      this._mapDataService.changeMapImageLayerDefinitionExpression(acreageConfig.layerId, expression);
      this.resetFilterForm();
    }
  }

  clearFilters() {
    if (this.activeClauses.length > 0) {
      this.clearActiveClauses();
      if (this._mapDataService.getLayerById(acreageConfig.layerId).type == 'feature') {
        this._mapDataService.changeLayerDefinitionExpression(acreageConfig.layerId, '');
      } else {
        this._mapDataService.changeMapImageLayerDefinitionExpression(acreageConfig.layerId, '');
      }

    }
  }

  getLayerExpression(): string {
    let layer = this._mapDataService.getMapImageLayerById(acreageConfig.layerId);
    let expression: string = '';
    layer.sublayers.forEach(sublayer => {
      expression = sublayer.definitionExpression;
    });
    return expression;
  }

  clearFilter(clause: any) {
    let index = this.activeClauses.indexOf(clause);
    this.activeClauses.splice(index, 1);
    let newExpression = this.activeClauses.join(' AND ');
    this._mapDataService.changeLayerDefinitionExpression(acreageConfig.layerId, newExpression);
  }

  addAsNewLayer(): void {

   if (this.activeClauses.length > 0) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      name: 'add-new-map-image',
      expression: this.getLayerExpression(),
      parentId: acreageConfig.layerId,
      url: acreageConfig.url
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

}
