import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/ui/sidebar/sidebar.component';
import { PanelComponent } from './components/ui/panel/panel.component';
import { WidgetListComponent } from './components/ui/widget-list/widget-list.component';
import { WidgetItemComponent } from './components/ui/widget-item/widget-item.component';
import { AcreageComponent } from './components/features/acreage/acreage.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AreaSelectComponent } from './components/features/area-select/area-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapDataService } from './services/map-data.service';
import { ContractsDataService } from './services/contracts-data.service';
import { PanelService } from './services/panel.service';
import { ModalComponent } from './components/ui/modal/modal.component';
import { ThirdPartyComponent } from './components/features/third-party/third-party.component';
import { LayersComponent } from './components/features/layers/layers.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { SymbologyComponent } from './components/features/symbology/symbology.component';
import { SizerComponent } from './components/ui/sizer/sizer.component';
import { SelectComponent } from './components/ui/select/select.component';
import { SymbologyResolverService } from './services/resolvers/symbology-resolver.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AutocompleteInputComponent } from './components/ui/autocomplete-input/autocomplete-input.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PanelComponent,
    WidgetListComponent,
    WidgetItemComponent,
    AreaSelectComponent,
    AcreageComponent,
    ModalComponent,
    ThirdPartyComponent,
    LayersComponent,
    SymbologyComponent,
    SizerComponent,
    SelectComponent,
    AutocompleteInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    ColorPickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule
  ],
  providers: [
    MapDataService,
    ContractsDataService,
    PanelService,
    SymbologyResolverService,
    //{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasbackDrop: false}}
  ],
  entryComponents: [PanelComponent, ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
