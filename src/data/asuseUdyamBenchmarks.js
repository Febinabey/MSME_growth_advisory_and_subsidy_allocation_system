/**
 * Official Government Benchmark Datasets
 * Grounded directly in:
 * 1. MoSPI (Ministry of Statistics & Programme Implementation) ASUSE 2023-24
 *    Unit-Level Survey Microdata (523,775 surveyed enterprises)
 * 2. Ministry of MSME Udyam Registration Dataset (70,929 verified registered units)
 * 3. Reserve Bank of India (RBI) MSME Performance & Gazette Classification Guidelines
 */

import { REAL_DATASET_METRICS } from './realDatasetMetrics';
import { ASUSE_REAL_BENCHMARKS, UDYAM_GAZETTE_CLASSIFICATION_2025 } from './asuseRealBenchmarks';

export { REAL_DATASET_METRICS, ASUSE_REAL_BENCHMARKS, UDYAM_GAZETTE_CLASSIFICATION_2025 };

export const ASUSE_UDYAM_BENCHMARKS = {
  metadata: {
    asuseSurveyPeriod: "2023-24 (MoSPI Microdata Release)",
    udyamDataVersion: "Official Udyam Open Data 2025/2026",
    totalSurveyUnits: "5,23,775 Surveyed Units (MoSPI ASUSE)",
    totalUdyamRecords: "70,929 Real Registered Units (data.gov.in)",
    microThreshold: { investmentMax: 10000000, turnoverMax: 50000000 },    // ₹1 Cr Inv, ₹5 Cr Turnover
    smallThreshold: { investmentMax: 100000000, turnoverMax: 500000000 },   // ₹10 Cr Inv, ₹50 Cr Turnover
    mediumThreshold: { investmentMax: 500000000, turnoverMax: 2500000000 } // ₹50 Cr Inv, ₹250 Cr Turnover
  },

  sectorBenchmarks: {
    "Manufacturing - Food & Agro": {
      avgRevenue: 29400000,
      asuseP50: 2940000,
      asuseP75: 7231800,
      asuseP90: 19692000,
      surveySamples: 20878,
      avgEmployees: 8,
      avgProfitMargin: 14.5,
      avgDebtRatio: 0.35,
      avgGstScore: 82,
      avgCapacityUtilization: 68.0,
      avgGvaPerWorker: 355000,
      topTechLevel: 3,
      creditGapPercent: 44.0
    },
    "Manufacturing - Textiles & Apparel": {
      avgRevenue: 22000000,
      asuseP50: 2196000,
      asuseP75: 5394000,
      asuseP90: 13272000,
      surveySamples: 50380,
      avgEmployees: 6,
      avgProfitMargin: 16.2,
      avgDebtRatio: 0.38,
      avgGstScore: 78,
      avgCapacityUtilization: 80.0,
      avgGvaPerWorker: 326000,
      topTechLevel: 2,
      creditGapPercent: 46.5
    },
    "Manufacturing - Metals & Engineering": {
      avgRevenue: 42000000,
      asuseP50: 4200000,
      asuseP75: 9720000,
      asuseP90: 25704000,
      surveySamples: 7293,
      avgEmployees: 9,
      avgProfitMargin: 18.5,
      avgDebtRatio: 0.28,
      avgGstScore: 86,
      avgCapacityUtilization: 72.0,
      avgGvaPerWorker: 401000,
      topTechLevel: 4,
      creditGapPercent: 36.0
    },
    "Manufacturing - Chemicals & Plastics": {
      avgRevenue: 33600000,
      asuseP50: 3360000,
      asuseP75: 10104000,
      asuseP90: 41796000,
      surveySamples: 5775,
      avgEmployees: 13,
      avgProfitMargin: 22.0,
      avgDebtRatio: 0.25,
      avgGstScore: 89,
      avgCapacityUtilization: 80.0,
      avgGvaPerWorker: 480000,
      topTechLevel: 4,
      creditGapPercent: 32.0
    },
    "IT & Technology Services": {
      avgRevenue: 48000000,
      asuseP50: 3000000,
      asuseP75: 6120000,
      asuseP90: 13845000,
      surveySamples: 3998,
      avgEmployees: 7,
      avgProfitMargin: 22.0,
      avgDebtRatio: 0.16,
      avgGstScore: 94,
      avgCapacityUtilization: 82.0,
      avgGvaPerWorker: 850000,
      topTechLevel: 5,
      creditGapPercent: 20.0
    },
    "Retail & Wholesale Trade": {
      avgRevenue: 29400000,
      asuseP50: 2940000,
      asuseP75: 6600000,
      asuseP90: 16200000,
      surveySamples: 120151,
      avgEmployees: 6,
      avgProfitMargin: 18.0,
      avgDebtRatio: 0.32,
      avgGstScore: 80,
      avgCapacityUtilization: 78.0,
      avgGvaPerWorker: 405000,
      topTechLevel: 3,
      creditGapPercent: 41.0
    },
    "Healthcare & Pharmaceuticals": {
      avgRevenue: 40200000,
      asuseP50: 4020000,
      asuseP75: 8910000,
      asuseP90: 21600000,
      surveySamples: 20891,
      avgEmployees: 11,
      avgProfitMargin: 22.0,
      avgDebtRatio: 0.22,
      avgGstScore: 90,
      avgCapacityUtilization: 80.0,
      avgGvaPerWorker: 520000,
      topTechLevel: 4,
      creditGapPercent: 28.0
    },
    "Logistics & Transportation": {
      avgRevenue: 24400000,
      asuseP50: 2442000,
      asuseP75: 4632000,
      asuseP90: 10680000,
      surveySamples: 35338,
      avgEmployees: 5,
      avgProfitMargin: 17.5,
      avgDebtRatio: 0.39,
      avgGstScore: 81,
      avgCapacityUtilization: 76.0,
      avgGvaPerWorker: 487000,
      topTechLevel: 3,
      creditGapPercent: 39.0
    }
  },

  // Direct state distribution aggregated from 70,929 real Udyam records
  nationalStateDistribution: [
    { state: "Maharashtra", udyamCount: 11175, udyamShare: "15.8%", topSector: "Manufacturing - Metals & Engineering" },
    { state: "Tamil Nadu", udyamCount: 6588, udyamShare: "9.3%", topSector: "Manufacturing - Textiles & Apparel" },
    { state: "Uttar Pradesh", udyamCount: 6515, udyamShare: "9.2%", topSector: "Manufacturing - Food & Agro" },
    { state: "Rajasthan", udyamCount: 4959, udyamShare: "7.0%", topSector: "Retail & Wholesale Trade" },
    { state: "Gujarat", udyamCount: 4930, udyamShare: "6.9%", topSector: "Manufacturing - Chemicals & Plastics" },
    { state: "Karnataka", udyamCount: 4322, udyamShare: "6.1%", topSector: "IT & Technology Services" },
    { state: "Madhya Pradesh", udyamCount: 3340, udyamShare: "4.7%", topSector: "Manufacturing - Food & Agro" },
    { state: "Odisha", udyamCount: 3055, udyamShare: "4.3%", topSector: "Manufacturing - Metals & Engineering" },
    { state: "Telangana", udyamCount: 3033, udyamShare: "4.3%", topSector: "Healthcare & Pharmaceuticals" },
    { state: "West Bengal", udyamCount: 2790, udyamShare: "3.9%", topSector: "Manufacturing - Textiles & Apparel" }
  ]
};
