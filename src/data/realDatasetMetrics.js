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
  }
};
