/**
 * Indian Rupee & MSME Statutory Classification Utility
 * Formats currency dynamically according to standard Indian numbering conventions
 * and categorizes enterprises under Gazette Notifications S.O. 2119(E) & S.O. 1364(E).
 * 
 * Composite Criteria Framework:
 * - Micro: Investment in Plant & Machinery <= ₹2.5 Cr AND Turnover <= ₹10 Cr
 * - Small: Investment in Plant & Machinery <= ₹25 Cr AND Turnover <= ₹100 Cr
 * - Medium: Investment in Plant & Machinery <= ₹125 Cr AND Turnover <= ₹250 Cr
 * - Large: Exceeds either Medium ceiling (Ineligible for MSME schemes)
 */

export function formatINR(amount, options = {}) {
  const { showBoth = false, compact = false } = options;
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  if (isNaN(num)) return '₹0';

  if (num >= 10000000) {
    // 1 Crore = 10,000,000 INR
    const crVal = num / 10000000;
    const crFormatted = crVal % 1 === 0 ? crVal.toFixed(0) : crVal.toFixed(2).replace(/\.?0+$/, '');
    
    if (showBoth) {
      const lakhsVal = (num / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 });
      return `₹${crFormatted} Cr (${lakhsVal} Lakhs)`;
    }
    return compact ? `₹${crFormatted} Cr` : `₹${crFormatted} Crore`;
  } else if (num >= 100000) {
    // 1 Lakh = 100,000 INR
    const lakhsVal = num / 100000;
    const lakhsFormatted = lakhsVal % 1 === 0 ? lakhsVal.toFixed(0) : lakhsVal.toFixed(1).replace(/\.?0+$/, '');
    return compact ? `₹${lakhsFormatted} L` : `₹${lakhsFormatted} Lakhs`;
  } else {
    return `₹${num.toLocaleString('en-IN')}`;
  }
}

export const MIN_MSME_TURNOVER = 1000000;      // ₹10 Lakhs
export const MAX_MSME_TURNOVER = 2500000000;   // ₹250 Crore (Statutory MSME Turnover Ceiling)
export const MAX_MSME_INVESTMENT = 1250000000; // ₹125 Crore (Statutory MSME Investment Ceiling)

/**
 * Returns the statutory MSME category under MSMED Act and Gazette Composite Classification.
 * If either Turnover or Investment crosses a tier's ceiling, the enterprise is placed
 * in the next higher category (Para 2(1) of Gazette Notification S.O. 2119(E)).
 */
export function getMSMETier(annualRevenue, machineryInvestment = 0) {
  const rev = Number(annualRevenue) || 0;
  const inv = Number(machineryInvestment) || 0;

  // Composite check: Breaching either limit disqualifies enterprise from MSME tier
  if (rev > MAX_MSME_TURNOVER || inv > MAX_MSME_INVESTMENT) {
    return {
      tier: 'Large',
      label: 'Large Enterprise (Non-MSME)',
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.12)',
      borderColor: 'rgba(220, 38, 38, 0.35)',
      badgeClass: 'badge-rose',
      range: '> ₹250 Cr Turnover / > ₹125 Cr Inv',
      isMSME: false,
      description: 'Exceeds statutory MSME threshold (> ₹250 Cr Turnover or > ₹125 Cr Investment) — Ineligible for MSME schemes'
    };
  }
  if (rev > 1000000000 || inv > 250000000) {
    return {
      tier: 'Medium',
      label: 'Medium Enterprise',
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.12)',
      borderColor: 'rgba(124, 58, 237, 0.35)',
      badgeClass: 'badge-purple',
      range: '₹100 Cr – ₹250 Cr Turnover / ₹25 Cr – ₹125 Cr Inv',
      isMSME: true,
      description: 'Medium Enterprise (Upper MSME statutory tier)'
    };
  }
  if (rev > 100000000 || inv > 25000000) {
    return {
      tier: 'Small',
      label: 'Small Enterprise',
      color: '#2563eb',
      bgColor: 'rgba(37, 99, 235, 0.12)',
      borderColor: 'rgba(37, 99, 235, 0.35)',
      badgeClass: 'badge-blue',
      range: '₹10 Cr – ₹100 Cr Turnover / ₹2.5 Cr – ₹25 Cr Inv',
      isMSME: true,
      description: 'Small Enterprise'
    };
  }
  return {
    tier: 'Micro',
    label: 'Micro Enterprise',
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.12)',
    borderColor: 'rgba(5, 150, 105, 0.35)',
    badgeClass: 'badge-emerald',
    range: '≤ ₹10 Cr Turnover & ≤ ₹2.5 Cr Inv',
    isMSME: true,
    description: 'Micro Enterprise'
  };
}
