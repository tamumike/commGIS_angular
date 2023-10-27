import { environment } from 'src/environments/environment';

export const areaSelectConfig = {
  url: `${environment.baseUrl}/Commercial/Areas/MapServer`,
  queryURL: environment.baseUrl + "Commercial/Areas/MapServer/0",
  layerId:'areas'
}
