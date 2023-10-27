import { environment } from 'src/environments/environment';
import FieldColumnTemplate from '@arcgis/core/widgets/FeatureTable/support/FieldColumnTemplate';

export const acreageConfig = {
  url: environment.baseUrl + 'Commercial/Contracts/MapServer/',
  queryURL: environment.baseUrl + "Commercial/Contracts/MapServer/0",
  layerId: 'acreage',
  layerTitle: 'Acreage',
  intFields: ['FAC_ID', 'PP_ID'],
  autofillFields: ['COUNTY', 'FAC_ID', 'PP_ID', 'PRODUCER']
}
