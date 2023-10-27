import { environment } from 'src/environments/environment';

export const thirdPartyConfig = {
  url: environment.baseUrl + `Rextag/`,
  queryURL: environment.baseUrl + 'Rextag/',
  defaultFeature: 'NaturalGasPipelines',
  features: ['CrudeOilPipelines',
              'Rextag_Natural_Gas_Compressors',
              'NaturalGasPipelines50mi',
              'Rextag_Natural_Gas_Processing_Plants',
              'OtherLiquidsPipelines'
      ],
  layerId: 'rextag_',
  layerTitle: 'Rextag - ',
  intFields: ['DIAMETER', 'TRANSCAP', 'TRANS_DATE', 'MILES'],
  autofillFields: ['NAME', 'OPERATOR', 'OWNER', 'TYPE', 'SYS_NAME', 'STATUS', 'COMMODITY',
                   'CMDTY_CODE', 'INTERSTATE', 'FLOW_DIR', 'RATE_ZONE', 'STATE']
}
