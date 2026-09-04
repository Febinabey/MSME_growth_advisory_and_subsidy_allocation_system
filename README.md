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

## 📊 Real Datasets & Benchmarks Integrated

1. **MoSPI ASUSE 2023–24 (Annual Survey of Unincorporated Sector Enterprises)**
   * Source: Ministry of Statistics and Programme Implementation (MoSPI), Govt. of India (July 2024).
   * Scope: Unit-level survey data from 6.5 Crore enterprises providing Gross Value Added (GVA) per worker benchmarks, capacity utilization rates, turnover averages, and labor productivity indices across sectors.
2. **Ministry of MSME Udyam Registration & Open Government Data (OGD)**
   * Official classification thresholds (Micro: $\le ₹2.5\text{Cr}$ Inv / $\le ₹10\text{Cr}$ Turnover; Small: $\le ₹25\text{Cr}$ Inv / $\le ₹100\text{Cr}$ Turnover; Medium: $\le ₹125\text{Cr}$ Inv / $\le ₹500\text{Cr}$ Turnover).
   * State and district-wise MSME distribution data.
3. **Official Scheme Guidelines Master Database (myScheme & Ministry of MSME)**
   * Structurally parsed parameters for 30+ schemes including **PMEGP, CLCSS, ZED, CGTMSE, MSME Champions, SAMERTH Industry 4.0, SFURTI, MSE-CDP, PM-FME, ATUFS, Stand Up India, PM Vishwakarma, TREAD, SMILE, Digital MSME, LMCS**, and more.
4. **Reserve Bank of India (RBI) & SIDBI MSME Financial Health Indicators**
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
