import { Routes } from "@angular/router";
import { AcreageComponent } from "./components/features/acreage/acreage.component";
import { LayersComponent } from "./components/features/layers/layers.component";
import { SymbologyComponent } from "./components/features/symbology/symbology.component";
import { ThirdPartyComponent } from "./components/features/third-party/third-party.component";
import { SymbologyResolverService } from "./services/resolvers/symbology-resolver.service";

export const appRoutes: Routes = [
  { path: '**', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Acreage', component: AcreageComponent },
  { path: 'Layers', component: LayersComponent },
  { path: 'Third Party', component: ThirdPartyComponent },
  { path: 'Symbology/:id', component: SymbologyComponent, resolve: {data: SymbologyResolverService} }
];
