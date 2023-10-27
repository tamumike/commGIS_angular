import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import { environment } from 'src/environments/environment';

export const config = {
  widgets: ['Layers', 'Acreage', 'Third Party'],
  systemLayers: ['acreage', 'pipes', 'stations']
};

export const systemLayers: any[] = [
  {id: 'areas',
    title: 'Asset Areas',
    url: environment.baseUrl + 'Commercial/Areas/MapServer',
    visible: false,
    popupEnabled: false,
    searchConfig: {
      searchFields: ["NAME"],
      displayField: "NAME",
      exactMatch: false,
      outFields: ["*"],
      name: "Asset Areas",
      placeholder: "example: Versado"
    }
  },
  { id: 'pipes',
    title: 'Targa Pipes',
    url: environment.baseUrl + '/SDEServices/Targa_Pipes/MapServer',
    visible: true,
    // sublayers: [{
    //   id: 0,

    // }],
    popupEnabled: true,
    popupTemplate: {
      title: '{engroutename}',
      content: [{
        type: 'fields',
        fieldInfos: [{
            fieldName: 'lifecyclestatus',
            label: 'Status'
          }, {
            fieldName: 'nominaldiameter',
            label: 'Nominal Diameter'
          }, {
            fieldName: 'wallthickness',
            label: 'Wall Thickness'
          }, {
            fieldName: 'maopdesign',
            label: 'MAOP'
          }, {
            fieldName: 'material',
            label: 'Grade'
          }, {
            fieldName: 'commodity',
            label: 'Commodity'
          }, {
            fieldName: 'system',
            label: 'System'
          }, {
            fieldName: 'segment',
            label: 'Segment'
          }, {
            fieldName: 'areaid',
            label: 'Area'
          }, {
            fieldName: 'buid',
            label: 'Business Unit'
          }
        ]
      }]
    },
    renderer: new UniqueValueRenderer({
      legendOptions: {
        title: 'Pipe Use'
      },
      defaultSymbol: new SimpleLineSymbol({
          width: '2px',
          style: 'solid',
          color: '#4E4E4E'}),
      defaultLabel: 'Unknown',
      field: 'pipeuse',
      uniqueValueInfos: [
        {
          value: 'Transmission Pipe',
          label: 'Transmission',
          symbol: new SimpleLineSymbol({
            width: '2px',
            style: 'solid',
            color: '#FF0000'
          })
        },{
          value: 'Gathering Pipe',
          label: 'Gathering',
          symbol: new SimpleLineSymbol({
            width: '2px',
            style: 'solid',
            color: '#0070FF'
          })
        }, {
          value: 'Station Pipe',
          label: 'Station Pipe',
          symbol: new SimpleLineSymbol({
            width: '2px',
            style: 'solid',
            color: '#FFFF00'
          })
        }, {
          value: 'Unknown',
          label: 'Unknown',
          symbol: new SimpleLineSymbol({
            width: '2px',
            style: 'solid',
            color: '#FFAA00'
          })
        }
      ]
    }),
    searchConfig: {
      searchFields: ["engroutename", "segment"],
      displayField: "engroutename",
      exactMatch: false,
      outFields: ["*"],
      name: "Targa Pipes",
      placeholder: "Search by Pipe ID or Segment"
    }
  },
  {id: 'stations',
    title: 'Targa Stations',
    url: environment.baseUrl + 'MaximoServices/MaximoFacilitiesService/MapServer',
    visible: true,
    popupEnabled: true,
    popupTemplate: {
      title: '{DESCRIPTION}',
      content: [{
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'FACILITYTYPE',
            label: 'Type'
          }, {
            fieldName: 'FACID',
            label: 'Facility ID'
          }, {
            fieldName: 'FACNO',
            label: 'Facility No.'
          }, {
            fieldName: 'TYPE',
            label: 'Type'
          }, {
            fieldName: 'FAC_ID',
            label: 'Facility ID'
          }, {
            fieldName: 'MXLOCATION',
            label: 'Location'
          }, {
            fieldName: 'MXSTATUS',
            label: 'Status'
          }, {
            fieldName: 'LATITUDE',
            label: 'Latitude'
          }, {
            fieldName: 'LONGITUDE',
            label: 'Longitude'
          }, {
            fieldName: 'AFENO',
            label: 'AFE No.'
          }, {
            fieldName: 'DraftingLink',
            label: 'Drafting Link'
          }, {
            fieldName: 'AREAID',
            label: 'Area'
          }
        ]
      }]
    },
    searchConfig: {
      searchFields: ["DESCRIPTION"],
      displayField: "DESCRIPTION",
      exactMatch: false,
      outFields: ["*"],
      name: "Targa Stations",
      placeholder: "Search by Name"
    }
  },
  {id: 'meters-daily',
    title: 'Meters Daily',
    url: environment.baseUrl + 'SDEServices/MR_Volumes_Daily/MapServer',
    visible: false,
    popupEnabled: true,
    popupTemplate: {
      title: '{IN_NAME}',
      content: [{
        type: 'fields',
        fieldInfos: [
        {
          fieldName: 'METERID',
          label: 'Meter ID'
        }, {
          fieldName: 'LEASE',
          label: 'Lease'
        },{
          fieldName: 'MCFPD',
          label: 'MCFPD'
        }, {
          fieldName: 'PSIA',
          label: 'PSIA'
        }, {
          fieldName: 'PSIG',
          label: 'PSIG'
        }, {
          fieldName: 'DIFF_PRESS',
          label: 'Diff Press'
        }, {
          fieldName: 'H2S_MOLE_PCT',
          label: 'H2S MOL %',
          format: {
            digitSeparator: true,
            places: 5
          }
        }, {
          fieldName: 'CO2_MOLE_PCT',
          label: 'CO2 MOLE %',
          format: {
            digitSeparator: true,
            places: 5
          }
        }, {
          fieldName: 'N2_MOLE_PCT',
          label: 'N2 MOLE %',
          format: {
            digitSeparator: true,
            places: 5
          }
        }, {
          fieldName: 'RESIDUE_N2',
          label: 'Residue N2'
        }, {
          fieldName: 'PRODUCER',
          label: 'Producer'
        }]
      }]
    },
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: "orange",
        style: 'circle',
        size: '8px',
        outline: new SimpleLineSymbol({
          color: 'black',
          width: 1
        })
      })
    }),
    searchConfig: {
      searchFields: ["IN_NAME", "LEASE", "METERID"],
      displayField: "IN_NAME",
      exactMatch: false,
      outfields: ["*"],
      name: 'Meters Daily',
      placeholder: 'Search by Name, Lease, ID'
    },
  },
  {id: 'meters-monthly',
    title: 'Meters Monthly',
    url: environment.baseUrl + 'SDEServices/MR_Volumes_Monthly/MapServer',
    visible: false,
    popupEnabled: true,
    popupTemplate: {
      title: '{IN_NAME}',
      content: [{
        type: 'fields',
        fieldInfos: [
        {
          fieldName: 'METERID',
          label: 'Meter ID'
        }, {
          fieldName: 'LEASE',
          label: 'Lease'
        }, {
          fieldName: 'MCFPD',
          label: 'MCFPD',
          format: {
            digitSeparator: true,
            places: 3
          }
        },{
          fieldName: 'MCF',
          label: 'MCF',
          format: {
            digitSeparator: true,
            places: 3
          }
        }, {
          fieldName: 'PSIA',
          label: 'PSIA'
        }, {
          fieldName: 'PSIG',
          label: 'PSIG'
        }, {
          fieldName: 'DIFF_PRESS',
          label: 'Diff Press'
        }, {
          fieldName: 'H2S_MOLE_PCT',
          label: 'H2S MOL %',
          format: {
            digitSeparator: true,
            places: 5
          }
        }, {
          fieldName: 'CO2_MOLE_PCT',
          label: 'CO2 MOLE %',
          format: {
            digitSeparator: true,
            places: 5
          }
        }, {
          fieldName: 'N2_MOLE_PCT',
          label: 'N2 MOLE %',
          format: {
            digitSeparator: true,
            places: 5
          }
        }, {
          fieldName: 'H2S_MCF',
          label: 'H2S MCF'
        }, {
          fieldName: 'CO2_MCF',
          label: 'CO2 MCF'
        }, {
          fieldName: 'RESIDUE_N2',
          label: 'Residue N2'
        }, {
          fieldName: 'PRODUCER',
          label: 'Producer'
        }]
      }]
    },
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: "green",
        style: 'circle',
        size: '8px',
        outline: new SimpleLineSymbol({
          color: 'black',
          width: 1
        })
      })
    }),
    searchConfig: {
      searchFields: ["IN_NAME", "LEASE", "METERID"],
      displayField: "IN_NAME",
      exactMatch: false,
      outfields: ["*"],
      name: 'Meters Monthly',
      placeholder: 'Search by Name, Lease, ID'
    }
  }
];


export const popups = {
  contracts: {
    title: '{CONTRACT} - {PRODUCER}',
    content: [{
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'CONTRACT',
          label: 'Contract'
        }, {
          fieldName: 'TRACT',
          label: 'Tract'
        }, {
          fieldName: 'LEASE',
          label: 'Lease'
        }, {
          fieldName: 'DESCRIPT',
          label: 'Description'
        }, {
          fieldName: 'SECT',
          label: 'Section'
        }, {
          fieldName: 'TOWNSHIP',
          label: 'Township'
        }, {
          fieldName: 'RANGE',
          label: 'Range'
        }, {
          fieldName: 'ABSTRACT',
          label: 'Abstract'
        }, {
          fieldName: 'SURVEY',
          label: 'Survey'
        }, {
          fieldName: 'LEAGUE',
          label: 'League'
        }, {
          fieldName: 'LABOR',
          label: 'Labor'
        }, {
          fieldName: 'BLK',
          label: 'Block'
        }, {
          fieldName: 'COUNTY',
          label: 'County'
        }, {
          fieldName: 'DEPTH',
          label: 'Depth'
        }, {
          fieldName: 'TYPE',
          label: 'Type'
        }, {
          fieldName: 'COMMENTS',
          label: 'Comments'
        }, {
          fieldName: 'CONT_TR',
          label: 'CONT_TR'
        }, {
          fieldName: 'FAC_ID',
          label: 'Facility ID'
        }, {
          fieldName: 'PP_ID',
          label: 'PP ID'
        }, {
          fieldName: 'PRODUCER',
          label: 'Producer'
        }
      ]
    }]
  },
  rextag_pipes: {
    title: '{NAME} - {OPERATOR}',
    content: [{
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'NAME',
          label: 'Name'
        }, {
          fieldName: 'OPERATOR',
          label: 'Operator'
        }, {
          fieldName: 'SUB_OPER',
          label: 'Sub Operator'
        }, {
          fieldName: 'OWNER',
          label: 'Owner'
        }, {
          fieldName: 'SYS_NAME',
          label: 'System Name'
        }, {
          fieldName: 'SUBSYS_NM',
          label: 'Subsystem Name'
        }, {
          fieldName: 'TYPE',
          label: 'Type'
        }, {
          fieldName: 'STATUS',
          label: 'Status'
        }, {
          fieldName: 'DIAMETER',
          label: 'Diameter',
          format: {
            digitSeparator: true,
            places: 3
          }
        }, {
          fieldName: 'TRANSCAP',
          label: 'Transcap'
        }, {
          fieldName: 'COMMODITY',
          label: 'Commodity'
        }, {
          fieldName: 'CMDTY_DESC',
          label: 'Commodity Desc.'
        }, {
          fieldName: 'CMDTY_CODE',
          label: 'Commodity Code'
        }, {
          fieldName: 'INTERSTATE',
          label: 'Interstate'
        }, {
          fieldName: 'FLOW_DIR',
          label: 'Flow Direction'
        }, {
          fieldName: 'RATE_ZONE',
          label: 'Rate Zone'
        }, {
          fieldName: 'PREV_OWNER',
          label: 'Previous Owner'
        }, {
          fieldName: 'TRANS_DATE',
          label: 'Transaction Date'
        }, {
          fieldName: 'TRANS_NOTE',
          label: 'Transaction Notes'
        }, {
          fieldName: 'TRANS_ID',
          label: 'Transaction ID'
        }, {
          fieldName: 'LOC_ID',
          label: 'Location ID'
        }, {
          fieldName: 'LOC_DOCS',
          label: 'Location Docs'
        }, {
          fieldName: 'SEG_ID',
          label: 'Segment ID'
        }, {
          fieldName: 'SUBSEG_ID',
          label: 'Sub Segment ID'
        }, {
          fieldName: 'SUBOPER_ID',
          label: 'Sub Operator ID'
        }, {
          fieldName: 'OPER_ID',
          label: 'Operator ID'
        }, {
          fieldName: 'OPER_URL',
          label: 'Operator URL'
        }, {
          fieldName: 'OPER_DOCS',
          label: 'Operator Docs'
        }, {
          fieldName: 'OWNER_ID',
          label: 'Owner ID'
        }, {
          fieldName: 'OWNER_URL',
          label: 'Owner URL'
        }, {
          fieldName: 'OWNER_DOCS',
          label: 'Owner Docs'
        }, {
          fieldName: 'CONTACTS_URL',
          label: 'Contacts URL'
        }, {
          fieldName: 'NOTES',
          label: 'Notes'
        }, {
          fieldName: 'CATCHALL',
          label: 'Catch All'
        }, {
          fieldName: 'CNTY_NAME',
          label: 'County'
        }, {
          fieldName: 'STATE_NAME',
          label: 'State'
        }, {
          fieldName: 'CNTRY_NAME',
          label: 'Country'
        }, {
          fieldName: 'MILES',
          label: 'Miles',
          format: {
            digitSeparator: true,
            places: 2
          }
        }, {
          fieldName: 'UPDATE_NO',
          label: 'Update No.'
        }, {
          fieldName: 'QUALITY',
          label: 'Quality'
        }
      ]
    }]
  }
};
