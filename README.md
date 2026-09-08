# AI-Powered Dual-Layer MSME Growth Advisory & Subsidy Optimization Platform

An intelligent decision-support system designed to empower Micro, Small, and Medium Enterprises (MSMEs) through predictive business growth analysis and personalized government scheme recommendation, while simultaneously assisting policymakers in mathematically optimizing budget-constrained subsidy allocations.

---

## 🌟 Overview & System Architecture

The platform operates on a unique **Dual-Layer Decision Framework**:

```
                   OFFICIAL GOVERNMENT DATASETS
            (MoSPI ASUSE 2023-24 & Ministry of MSME Udyam)
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│   LAYER 1: MSME ADVISORY LAYER  │   │   LAYER 2: POLICY OPTIMIZATION  │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│ • Enterprise Profile & Needs    │   │ • Total Government Budget Pool  │
│ • XGBoost Growth Predictor      │   │ • Policy Weightings (Jobs/Rev)  │
│ • SHAP Explainability Engine    │   │ • Knapsack (MCKP) Optimizer     │
│ • Semantic Scheme Recommendation│   │ • AI vs Baseline (FCFS) ROI     │
│ • "What-If" Scenario Simulator  │   │ • State/District Queue Audit    │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

### 1. Layer 1: MSME Growth Advisory & Scheme Matcher
* **Predictive AI Engine (XGBoost)**: Takes structured business data (Turnover, Revenue Growth Rate, Profit Margin, Debt-to-Revenue Ratio, Employee Scale, Technology Level, and GST Compliance Score) to predict a holistic **Growth Score (0–100)**, projected 1-year revenue uplift, and new job creation potential.
* **Model Explainability (SHAP)**: Uses SHapley Additive exPlanations to decompose predictions into exact marginal feature contributions ($\phi_i$), guaranteeing transparent, audit-ready AI reasoning.
* **Semantic Scheme Matcher**: Leverages semantic similarity and rules-based filtering across 30+ official schemes to match an MSME's unstructured business need with government guidelines.
* **"What-If" Scenario Simulator**: Dynamic sliders allowing business owners to simulate how improving operational variables (e.g. boosting GST score to 98% or adopting Industry 4.0 tech) upgrades their creditworthiness and subsidy access.
* **Executive Audit Report Generator**: Produces exportable/printable executive reports summarizing the enterprise diagnostic and recommended subsidies.

### 2. Layer 2: Government Policy & Subsidy Optimization Engine
* **Budget-Constrained Optimization**: Solves the allocation challenge as a **Multiple-Choice Knapsack Problem (MCKP)** using constrained uplift optimization.
* **Objective Function**: Maximizes overall economic impact $\sum (\text{Revenue Uplift}_i + w \cdot \text{Jobs Created}_i)$ subject to $\sum \text{Subsidy}_i \le B$.
* **Comparative Analytics**: Directly compares the AI Knapsack allocation against a conventional **First-Come-First-Served (FCFS)** baseline, computing job creation gains, revenue uplift multiplier, and budget efficiency percentages.
* **Fairness & Audit Log**: Complete decision audit trail ensuring accountability and equitable distribution across sectors and regions.

---

## 📊 Real Government Datasets & Granularities

The platform is backed by three distinct official Indian Government datasets, each serving a unique analytical granularity and methodological purpose:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THREE-TIER DATASET TAXONOMY                                           │
├─────────────────────────┬───────────────────────────────┬───────────────────────────────────────────────┤
│ Dataset                 │ Granularity                   │ Analytical Function in Platform               │
├─────────────────────────┼───────────────────────────────┼───────────────────────────────────────────────┤
│ 1. Udyam Registry       │ Enterprise-level (70,929 rows)│ Authentic registration, NIC codes, districts   │
│ 2. MoSPI ASUSE 2023-24  │ Enterprise-level (523k surveys) Operational financials, GVA, revenue percentiles│
│ 3. MoMSME/KVIC PMEGP    │ State-Year level (175 records)│ Regional programme absorption & job intensity │
└─────────────────────────┴───────────────────────────────┴───────────────────────────────────────────────┘
```

1. **Ministry of MSME Udyam Registration Registry (Open Government Data - data.gov.in)**
   * **Source**: Open Government Data (OGD) Platform, Ministry of MSME (`api.data.gov.in`, Resource ID: `8b68ae56-84cf-4728-a0a6-1be11028dea7`).
   * **Scope & Methodology**: The current project uses 70,929 Udyam records retrieved from the official Data.gov.in Udyam API resource. The downloader supports resumable batch retrieval if additional records are required.
   * **Granularity**: Enterprise-level registration and sector classification across 36 Indian States/UTs.
   * **Role**: Supplies authentic registered enterprise names, official state/district geographic distributions, and registered 5-digit National Industrial Classification (NIC) activities for Layer 1 simulation and Layer 2 applicant queues.

2. **MoSPI ASUSE 2023–24 (Annual Survey of Unincorporated Sector Enterprises)**
   * **Source**: Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India (July 2024 Microdata Release).
   * **Scope**: Official unit-level microdata covering **5,23,775 surveyed enterprise units** across 16 survey blocks.
   * **Granularity**: Enterprise-level financial and operational survey data.
   * **Role**: Empirically computes sector-wise revenue percentiles (P25, P50, P75, P90), Gross Value Added (GVA) per worker benchmarks, capacity utilization rates, and operational profit margins across Indian MSMEs.

3. **Ministry of MSME / KVIC PMEGP State-Wise Historical Dataset (2021-22 to 2025-26)**
   * **Source**: Ministry of MSME / Khadi & Village Industries Commission (KVIC) via Data.gov.in (`PMEGP_StateWise_Combined_2021-22_to_2025-26.csv`).
   * **Scope**: 175 state-year records across 35 Indian States/UTs covering 5 Financial Years.
   * **Granularity**: State-level macro programme performance and employment intensity norms.
   * **Benchmark Training Horizon**: 4 completed Financial Years (2021-22, 2022-23, 2023-24, 2024-25) representing **3,01,587 assisted units** and **24,12,696 estimated employment opportunities** (~8.0 persons/unit national norm).
   * **Role & Guardrail**: Provides regional programme-level macro benchmark context in Layer 2 (subsidy absorption, margin money utilization, and historical employment norms).
   * **Methodological Guardrail**: PMEGP is macro regional context, **NOT** an individual enterprise predictor. Individual enterprise growth and job predictions are generated by XGBoost trained on enterprise operational data (ASUSE + Udyam). FY 2025-26 data is provisional (as of 10-02-2026) and strictly excluded from model calibration.

4. **Official Scheme Guidelines Master Database (myScheme & Ministry of MSME)**
   * Structurally parsed parameters for 30+ schemes including **PMEGP, CLCSS, ZED, CGTMSE, MSME Champions, SAMERTH Industry 4.0, SFURTI, MSE-CDP, PM-FME, ATUFS, Stand Up India, PM Vishwakarma, TREAD, SMILE, Digital MSME, LMCS**, and more.

5. **Reserve Bank of India (RBI) & SIDBI MSME Financial Health Indicators**
   * Credit gap benchmarks and debt solvency risk indices.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* npm (bundled with Node.js)

### Installation & Execution

1. Clone this repository:
   ```bash
   git clone https://github.com/Febinabey/MSME_growth_advisory_and_subsidy_allocation_system.git
   cd MSME_growth_advisory_and_subsidy_allocation_system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

5. To build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite
* **Styling**: Modern Glassmorphism Design System, CSS Variables, Responsive Grid/Flexbox
* **Icons**: Lucide React
* **Algorithms & Logic**:
  * XGBoost-inspired Gradient Boosted Decision Matrix (`src/engine/xgboostPredictor.js`)
  * SHAP Feature Attribution Engine (`src/engine/shapExplainer.js`)
  * Rule-based & Semantic Matcher (`src/engine/semanticMatcher.js`)
  * Multiple-Choice Knapsack Optimizer (`src/engine/knapsackSolver.js`)
  * ASUSE/Udyam Benchmark Engine (`src/engine/benchmarkEngine.js`)

---

## 📜 License
This project is developed for academic research and decision support applications in the MSME sector.
