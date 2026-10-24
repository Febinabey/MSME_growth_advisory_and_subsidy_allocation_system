import { GOVERNMENT_SCHEMES } from '../data/schemes.js';

/**
 * Evaluates Scheme Eligibility & Semantic Compatibility Score
 * Inputs MSME metrics & requirement text, outputs ranked matching schemes.
 * Enforces Government of India Gazette S.O. 2119(E) & S.O. 1364(E) composite criteria.
 */
export function matchSchemesForMSME(metrics = {}, requirementText = "") {
  const {
    annualRevenue = 20000000,
    employees = 20,
    sector = "Manufacturing",
    techLevel = 3,
    gstScore = 80,
    machineryInvestment = 0,
    investmentPlantMachinery = 0
  } = metrics;

  const plantMachinery = Number(machineryInvestment || investmentPlantMachinery || 0);
  const isLargeCorporate = annualRevenue > 2500000000 || plantMachinery > 1250000000;

  const normalizedText = requirementText.toLowerCase();

  return GOVERNMENT_SCHEMES.map(scheme => {
    // 1. Rule-Based Eligibility Check
    const checks = {
      turnoverMatch: !isLargeCorporate && annualRevenue >= scheme.minTurnover && annualRevenue <= scheme.maxTurnover,
      employeeMatch: employees >= scheme.minEmployees && employees <= scheme.maxEmployees,
      sectorMatch: scheme.eligibleSectors.includes(sector),
      techMatch: techLevel >= scheme.minTechLevel,
      gstMatch: gstScore >= scheme.minGstScore
    };

    const passedChecksCount = Object.values(checks).filter(Boolean).length;
    const isEligible = !isLargeCorporate && passedChecksCount === 5;
    const isPartiallyEligible = !isLargeCorporate && passedChecksCount >= 3 && !isEligible;

    // 2. Semantic Similarity Score (Keyword & Term Overlap Engine)
    let matchedKeywordCount = 0;
    const totalKeywords = scheme.semanticKeywords.length;

    scheme.semanticKeywords.forEach(kw => {
      if (normalizedText.includes(kw.toLowerCase())) {
        matchedKeywordCount++;
      }
    });

    // Base semantic match percentage
    let semanticScore = Math.round((matchedKeywordCount / Math.max(1, totalKeywords)) * 70) + 30;
    
    // Add bonus if text explicitly aligns with category
    if (normalizedText.includes(scheme.category.toLowerCase())) {
      semanticScore += 15;
    }
    
    semanticScore = Math.min(98, semanticScore);

    // 3. Recommended Subsidy Calculation for this MSME
    // Large Corporates receive ₹0 MSME subsidy by law.
    // For operating enterprises, project scale is calibrated against turnover (up to 25% modernization capex).
    // For greenfield startups (annualRevenue = 0 or < ₹10L), project scale is calibrated to standard PMEGP/MUDRA unit benchmark (₹10L - ₹25L).
    let recommendedSubsidyAmount = 0;
    if (!isLargeCorporate) {
      const appraisedProjectCost = annualRevenue >= 1000000
        ? annualRevenue * 0.25
        : Math.min(2500000, scheme.maxSubsidy / (scheme.subsidyPercentage / 100));

      recommendedSubsidyAmount = Math.min(
        scheme.maxSubsidy,
        Math.max(100000, Math.round(appraisedProjectCost * (scheme.subsidyPercentage / 100)))
      );
    }

    return {
      ...scheme,
      isEligible,
      isPartiallyEligible,
      passedChecksCount,
      checks,
      semanticScore,
      recommendedSubsidyAmount,
      isLargeCorporate
    };
  }).sort((a, b) => {
    // Sort eligible first, then by semantic score
    if (a.isEligible !== b.isEligible) {
      return a.isEligible ? -1 : 1;
    }
    return b.semanticScore - a.semanticScore;
  });
}
