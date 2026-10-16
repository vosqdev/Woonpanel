export interface AggregatedInsight {
  metric: string;
  value: string | number;
  change: string;
  category: 'woonwensen' | 'woonscan' | 'woonopinie';
  source: string;
}

export const AGGREGATED_INSIGHTS: AggregatedInsight[] = [
  {
    metric: 'Verhuisbehoefte binnen 2 jaar',
    value: '44,2%',
    change: '+3,8% t.o.v. 2025',
    category: 'woonwensen',
    source: 'N = 14.820 respondenten',
  },
  {
    metric: 'Voorkeur voor betaalbare koopwoningen (< € 405k)',
    value: '61,7%',
    change: 'Grootste tekortsegment',
    category: 'woonwensen',
    source: 'CBS GM0344 / GM0363 / GM0599',
  },
  {
    metric: 'Wooncomfort tevredenheid (rapportcijfer)',
    value: '7,4 / 10',
    change: 'Huurders 6,8 vs Kopers 7,9',
    category: 'woonscan',
    source: 'Woonscan Index 2026',
  },
  {
    metric: 'Zorgen over energiekosten & isolatie',
    value: '52,1%',
    change: 'Sterkste correlatie met bouwjaar < 1985',
    category: 'woonscan',
    source: 'Woonscan Verduurzaming',
  },
  {
    metric: 'Steun voor STOMP-principe & autoluwe woonstraten',
    value: '72,4%',
    change: 'Prioriteit voor speelstraten & snelfietsas',
    category: 'woonopinie',
    source: 'Participatie Dronten-Zuid (N=1.120)',
  },
];

export const WOONDATA_GEOGRAPHIC_HIERARCHY = [
  {
    municipalityCode: 'GM0303',
    municipalityName: 'Dronten',
    districts: [
      {
        districtCode: 'WK030302',
        districtName: 'Dronten-Zuid',
        neighborhoods: [
          { neighborhoodCode: 'BU03030210', neighborhoodName: 'Uitleggebied Dronten-Zuid (Kwadrant 1 t/m 4)', responseCount: 1120, kAnonymityMet: true },
          { neighborhoodCode: 'BU03030220', neighborhoodName: 'De Zuid & De Houtkamp', responseCount: 460, kAnonymityMet: true },
          { neighborhoodCode: 'BU03030230', neighborhoodName: 'Dronten Kern / Centrum', responseCount: 520, kAnonymityMet: true },
        ],
      },
    ],
  },
  {
    municipalityCode: 'GM0344',
    municipalityName: 'Utrecht',
    districts: [
      {
        districtCode: 'WK034408',
        districtName: 'Zuidwest',
        neighborhoods: [
          { neighborhoodCode: 'BU03440810', neighborhoodName: 'Merwede', responseCount: 840, kAnonymityMet: true },
          { neighborhoodCode: 'BU03440820', neighborhoodName: 'Kanaleneiland-Noord', responseCount: 420, kAnonymityMet: true },
          { neighborhoodCode: 'BU03440830', neighborhoodName: 'Transwijk', responseCount: 310, kAnonymityMet: true },
        ],
      },
      {
        districtCode: 'WK034401',
        districtName: 'Binnenstad',
        neighborhoods: [
          { neighborhoodCode: 'BU03440101', neighborhoodName: 'Domplein e.o.', responseCount: 290, kAnonymityMet: true },
        ],
      },
    ],
  },
  {
    municipalityCode: 'GM0363',
    municipalityName: 'Amsterdam',
    districts: [
      {
        districtCode: 'WK036304',
        districtName: 'Westpoort / Haven-Stad',
        neighborhoods: [
          { neighborhoodCode: 'BU03630410', neighborhoodName: 'Minervahaven', responseCount: 520, kAnonymityMet: true },
          { neighborhoodCode: 'BU03630420', neighborhoodName: 'Sloterdijk-Centrum', responseCount: 430, kAnonymityMet: true },
        ],
      },
    ],
  },
  {
    municipalityCode: 'GM0599',
    municipalityName: 'Rotterdam',
    districts: [
      {
        districtCode: 'WK059909',
        districtName: 'Feijenoord',
        neighborhoods: [
          { neighborhoodCode: 'BU05990910', neighborhoodName: 'Afrikaanderwijk', responseCount: 380, kAnonymityMet: true },
          { neighborhoodCode: 'BU05990920', neighborhoodName: 'Katendrecht', responseCount: 580, kAnonymityMet: true },
        ],
      },
    ],
  },
];
