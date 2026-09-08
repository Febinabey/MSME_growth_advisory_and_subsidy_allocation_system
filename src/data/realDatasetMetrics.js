// Real Government Dataset Metadata & Provenance
export const REAL_DATASET_METRICS = {
  asuse: {
    name: "MoSPI Annual Survey of Unincorporated Sector Enterprises (ASUSE)",
    surveyYear: "2023-24",
    ministry: "Ministry of Statistics and Programme Implementation (MoSPI)",
    totalSurveyUnits: 523775,
    levelsAvailable: 16,
    keyMetricsExtracted: [
      "Gross Output / Annual Receipts (Block 7)",
      "Operating Expenses & Raw Materials (Block 3 & 7)",
      "Employment & Wages by Gender (Block 8)",
      "Gross Value Added (GVA) per worker",
      "Principal National Industrial Classification (NIC 2-digit/5-digit)"
    ]
  },
  udyam: {
    name: "Ministry of MSME Udyam Registration Registry",
    source: "Open Government Data (OGD) Portal - data.gov.in",
    resourceId: "8b68ae56-84cf-4728-a0a6-1be11028dea7",
    description: "The current project uses 70,929 Udyam records retrieved from the official Data.gov.in Udyam API resource. The downloader supports resumable batch retrieval if additional records are required.",
    totalLiveRecords: 70929,
    coverageStates: 36,
    topStates: [
  {
    "state": "Maharashtra",
    "count": 11175
  },
  {
    "state": "Tamil Nadu",
    "count": 6588
  },
  {
    "state": "Uttar Pradesh",
    "count": 6515
  },
  {
    "state": "Rajasthan",
    "count": 4959
  },
  {
    "state": "Gujarat",
    "count": 4930
  },
  {
    "state": "Karnataka",
    "count": 4322
  },
  {
    "state": "Madhya Pradesh",
    "count": 3340
  },
  {
    "state": "Odisha",
    "count": 3055
  },
  {
    "state": "Telangana",
    "count": 3033
  },
  {
    "state": "West Bengal",
    "count": 2790
  }
]
  },
  pmegp: {
    source: "Ministry of MSME / Khadi & Village Industries Commission (KVIC)",
    portal: "Data.gov.in",
    file: "PMEGP_StateWise_Combined_2021-22_to_2025-26.csv",
    recordCount: 175,
    statesCovered: 35,
    timeHorizon: "2021-22 to 2025-26 (5 FYs)",
    granularity: "State-Year aggregates",
    totalAssistedUnits: 301587, // training-eligible (FY22-FY25)
    totalEmployment: 2412696,   // training-eligible (FY22-FY25)
    role: "Layer 2 Macro Benchmark Context (Regional subsidy absorption & employment norms)",
    trainingEligibleYears: "2021-22, 2022-23, 2023-24, 2024-25",
    provisionalYear: "2025-26 (as of 10-02-2026, partial year)",
    dataIntegrityNotes: [
      "FY 2025-26 excluded from training/benchmarks due to partial-year status.",
      "FY 2024-25 state figures preserved as reported; reconciliation discrepancy with national dashboard documented.",
      "Unit discrepancy in FY22/FY23 Margin Money (reported in Lakhs vs Crores) calibrated."
    ]
  }
};
