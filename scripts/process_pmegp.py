import csv
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "raw", "PMEGP_StateWise_Combined_2021-22_to_2025-26.csv")
OUT_JS_PATH = os.path.join(BASE_DIR, "src", "data", "pmegpData.js")

# Normalization mapping for state names between PMEGP and Udyam/National standards
STATE_NORMALIZATION_MAP = {
    "Andaman Nicobar": "Andaman And Nicobar Islands",
    "Chandigarh-UT": "Chandigarh",
    "Jammu Kashmir": "Jammu And Kashmir",
    "Ladakh-UT": "Ladakh"
}

def normalize_state(raw_state):
    s = raw_state.strip()
    return STATE_NORMALIZATION_MAP.get(s, s)

def process_pmegp():
    with open(CSV_PATH, "r", encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        raw_rows = list(reader)

    records = []
    state_summaries = {}
    
    # Track statistics
    total_rows = len(raw_rows)
    years_seen = set()
    states_seen = set()
    provisional_count = 0
    validation_subject_count = 0

    for r in raw_rows:
        fy = r.get("Financial_Year", "").strip()
        state_orig = r.get("State", "").strip()
        state_norm = normalize_state(state_orig)
        years_seen.add(fy)
        states_seen.add(state_norm)

        # Parse numeric fields safely
        try:
            projects = int(float(r.get("No_of_Projects_Units_Assisted", 0)))
        except (ValueError, TypeError):
            projects = 0

        try:
            mm_val = float(r.get("Margin_Money_Rs_Cr", 0.0))
        except (ValueError, TypeError):
            mm_val = 0.0

        emp_raw = r.get("Estimated_Employment", "")
        try:
            emp = int(float(emp_raw)) if emp_raw and emp_raw.strip() else 0
        except (ValueError, TypeError):
            emp = 0

        # Financial year handling (STEP 5 & 6)
        # FY 2025-26: provisional, excluded from training/calibration
        # FY 2024-25: subject to validation discrepancy
        if fy == "2025-26":
            is_training_eligible = False
            data_status = "provisional"
            provisional_count += 1
        elif fy == "2024-25":
            is_training_eligible = True
            data_status = "subject_to_validation"
            validation_subject_count += 1
        else:
            is_training_eligible = True
            data_status = "final"

        # Derived metrics with safe division
        emp_per_project = round(emp / projects, 2) if projects > 0 else 0.0
        # In raw CSV, 2021-22 and 2022-23 margin money was reported in Lakhs (scale 100x), while 2023-24+ is in Crores.
        # We preserve the raw marginMoneyCr exactly as reported in raw data.
        # We also compute a normalized estimate in Cr for calibration:
        if fy in ["2021-22", "2022-23"] and mm_val > 1000.0:
            margin_money_cr_normalized = round(mm_val / 100.0, 4) # converted Lakhs to Crores
            unit_discrepancy_flag = "raw_reported_in_lakhs"
        else:
            margin_money_cr_normalized = round(mm_val, 4)
            unit_discrepancy_flag = "reported_in_crores"

        mm_per_project_lakhs = round((margin_money_cr_normalized * 100.0) / projects, 2) if projects > 0 else 0.0

        rec = {
            "financialYear": fy,
            "state": state_norm,
            "stateOriginal": state_orig,
            "projectsAssisted": projects,
            "marginMoneyCrRaw": mm_val,
            "marginMoneyCrEstimated": margin_money_cr_normalized,
            "estimatedEmployment": emp,
            "employmentPerProject": emp_per_project,
            "marginMoneyPerProjectLakhs": mm_per_project_lakhs,
            "isTrainingEligible": is_training_eligible,
            "dataStatus": data_status,
            "unitDiscrepancyFlag": unit_discrepancy_flag,
            "sourceNote": r.get("Data_Note", "")
        }
        records.append(rec)

        # Aggregate state historical calibration context for training-eligible years (FY 2021-22 to FY 2024-25)
        if is_training_eligible:
            if state_norm not in state_summaries:
                state_summaries[state_norm] = {
                    "state": state_norm,
                    "totalProjectsAssisted": 0,
                    "totalEmploymentEstimated": 0,
                    "totalMarginMoneyCr": 0.0,
                    "yearsCovered": []
                }
            state_summaries[state_norm]["totalProjectsAssisted"] += projects
            state_summaries[state_norm]["totalEmploymentEstimated"] += emp
            state_summaries[state_norm]["totalMarginMoneyCr"] += margin_money_cr_normalized
            state_summaries[state_norm]["yearsCovered"].append(fy)

    # Compute averages per state
    for s_name, s_data in state_summaries.items():
        tot_proj = s_data["totalProjectsAssisted"]
        tot_emp = s_data["totalEmploymentEstimated"]
        tot_mm = s_data["totalMarginMoneyCr"]
        s_data["historicalAvgEmploymentPerProject"] = round(tot_emp / tot_proj, 2) if tot_proj > 0 else 8.0
        s_data["historicalAvgMarginMoneyPerProjectLakhs"] = round((tot_mm * 100.0) / tot_proj, 2) if tot_proj > 0 else 0.0
        s_data["totalMarginMoneyCr"] = round(tot_mm, 2)

    # National average across training-eligible records
    nat_proj = sum(r["projectsAssisted"] for r in records if r["isTrainingEligible"])
    nat_emp = sum(r["estimatedEmployment"] for r in records if r["isTrainingEligible"])
    nat_mm = sum(r["marginMoneyCrEstimated"] for r in records if r["isTrainingEligible"])
    national_benchmark = {
        "totalProjectsAssisted": nat_proj,
        "totalEmploymentEstimated": nat_emp,
        "totalMarginMoneyCrEstimated": round(nat_mm, 2),
        "nationalAvgEmploymentPerProject": round(nat_emp / nat_proj, 2) if nat_proj > 0 else 8.0,
        "nationalAvgMarginMoneyPerProjectLakhs": round((nat_mm * 100.0) / nat_proj, 2) if nat_proj > 0 else 3.25
    }

    # Generate ES Module code
    js_content = f"""/**
 * PMEGP State-Wise Historical Government Programme Dataset (FY 2021-22 to 2025-26)
 * Source: Ministry of MSME / PMEGP Official Dashboard & Parliamentary Annexures
 * 
 * IMPORTANT METHODOLOGICAL CONSTRAINTS:
 * 1. FY 2025-26 data is PROVISIONAL (as of 10-02-2026) and strictly EXCLUDED from model training/calibration (isTrainingEligible = false).
 * 2. FY 2024-25 state figures are subject to national dashboard reconciliation.
 * 3. In FY 2021-22 and 2022-23, raw figures reflect reporting in Lakhs (scaled to Crores in marginMoneyCrEstimated for consistency).
 * 4. PMEGP statistics provide macro regional programme context and empirical benchmark intensity, NOT individual enterprise causality.
 */

export const PMEGP_STATE_RECORDS = {json.dumps(records, indent=2)};

export const PMEGP_STATE_BENCHMARKS = {json.dumps(state_summaries, indent=2)};

export const PMEGP_NATIONAL_BENCHMARK = {json.dumps(national_benchmark, indent=2)};

export const PMEGP_STATE_NORMALIZATION_MAP = {json.dumps(STATE_NORMALIZATION_MAP, indent=2)};

/**
 * Retrieve state-specific PMEGP historical programme statistics for an applicant
 * @param {{string}} stateName - Raw or normalized state name
 * @returns {{object}} State historical benchmark context
 */
export function getPmegpStateContext(stateName) {{
  if (!stateName) return PMEGP_NATIONAL_BENCHMARK;
  const normalized = PMEGP_STATE_NORMALIZATION_MAP[stateName] || stateName;
  return PMEGP_STATE_BENCHMARKS[normalized] || {{
    state: normalized,
    totalProjectsAssisted: 0,
    totalEmploymentEstimated: 0,
    totalMarginMoneyCr: 0,
    historicalAvgEmploymentPerProject: PMEGP_NATIONAL_BENCHMARK.nationalAvgEmploymentPerProject,
    historicalAvgMarginMoneyPerProjectLakhs: PMEGP_NATIONAL_BENCHMARK.nationalAvgMarginMoneyPerProjectLakhs
  }};
}}
"""

    with open(OUT_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Generated {OUT_JS_PATH}")
    print(f"Total Records: {len(records)}")
    print(f"Total States: {len(states_seen)}")
    print(f"Unique Financial Years: {sorted(list(years_seen))}")
    print(f"Provisional records (excluded from calibration): {provisional_count}")
    print(f"Subject to validation records: {validation_subject_count}")
    print(f"National Benchmark: {national_benchmark}")

if __name__ == "__main__":
    process_pmegp()
