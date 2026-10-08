import { GOVERNMENT_SCHEMES } from '../data/schemes.js';

/**
 * Evaluates Scheme Eligibility & Semantic Compatibility Score
 * Inputs MSME metrics & requirement text, outputs ranked matching schemes.
 */
export function matchSchemesForMSME(metrics, requirementText = "") {
  const {
    annualRevenue = 20000000,
    employees = 20,
    sector = "Manufacturing",
    techLevel = 3,
    gstScore = 80
  } = metrics;

  const normalizedText = requirementText.toLowerCase();

  return GOVERNMENT_SCHEMES.map(scheme => {
    // 1. Rule-Based Eligibility Check
    const checks = {
      turnoverMatch: annualRevenue >= scheme.minTurnover && annualRevenue <= scheme.maxTurnover,
      employeeMatch: employees >= scheme.minEmployees && employees <= scheme.maxEmployees,
      sectorMatch: scheme.eligibleSectors.includes(sector),
      techMatch: techLevel >= scheme.minTechLevel,
      gstMatch: gstScore >= scheme.minGstScore
    };

    const passedChecksCount = Object.values(checks).filter(Boolean).length;
    const isEligible = passedChecksCount === 5;
    const isPartiallyEligible = passedChecksCount >= 3 && !isEligible;

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
    // For operating enterprises, project scale is calibrated against turnover (up to 25% modernization capex).
    // For greenfield startups (annualRevenue = 0 or < ₹10L), project scale is calibrated to standard PMEGP/MUDRA unit benchmark (₹10L - ₹25L).
    const appraisedProjectCost = annualRevenue >= 1000000
      ? annualRevenue * 0.25
      : Math.min(2500000, scheme.maxSubsidy / (scheme.subsidyPercentage / 100));

    let recommendedSubsidyAmount = Math.min(
      scheme.maxSubsidy,
      Math.max(100000, Math.round(appraisedProjectCost * (scheme.subsidyPercentage / 100)))
    );

    return {
      ...scheme,
      isEligible,
      isPartiallyEligible,
      passedChecksCount,
      checks,
      semanticScore,
      recommendedSubsidyAmount
    };
  }).sort((a, b) => {
    // Sort eligible first, then by semantic score
    if (a.isEligible !== b.isEligible) {
      return a.isEligible ? -1 : 1;
    }
    return b.semanticScore - a.semanticScore;
  });
}
