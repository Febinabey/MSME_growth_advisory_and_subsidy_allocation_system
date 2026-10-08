/**
 * Indian Rupee & MSME Statutory Classification Utility
 * Formats currency dynamically according to standard Indian numbering conventions
 * and categorizes enterprises under Gazette Notification S.O. 1364(E) (effective April 1, 2025).
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
export const MAX_MSME_TURNOVER = 2500000000;   // ₹250 Crore (Statutory MSME Ceiling)

/**
 * Returns the statutory MSME category under MSMED Act and Gazette Classification:
 * - Micro: Annual Turnover <= ₹10 Cr
 * - Small: Annual Turnover > ₹10 Cr and <= ₹100 Cr
 * - Medium: Annual Turnover > ₹100 Cr and <= ₹250 Cr (Statutory MSME Ceiling)
 * - Large: Annual Turnover > ₹250 Cr (Non-MSME / Ineligible for MSME schemes)
 */
export function getMSMETier(annualRevenue) {
  const rev = Number(annualRevenue) || 0;
  if (rev > MAX_MSME_TURNOVER) {
    return {
      tier: 'Large',
      label: 'Large Enterprise (Non-MSME)',
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.12)',
      borderColor: 'rgba(220, 38, 38, 0.35)',
      badgeClass: 'badge-rose',
      range: '> ₹250 Cr',
      isMSME: false,
      description: 'Exceeds statutory MSME threshold (> ₹250 Cr) — Ineligible for MSME schemes'
    };
  }
  if (rev > 1000000000) {
    return {
      tier: 'Medium',
      label: 'Medium Enterprise',
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.12)',
      borderColor: 'rgba(124, 58, 237, 0.35)',
      badgeClass: 'badge-purple',
      range: '₹100 Cr – ₹250 Cr',
      isMSME: true,
      description: 'Medium Enterprise (Upper MSME statutory tier)'
    };
  }
  if (rev > 100000000) {
    return {
      tier: 'Small',
      label: 'Small Enterprise',
      color: '#2563eb',
      bgColor: 'rgba(37, 99, 235, 0.12)',
      borderColor: 'rgba(37, 99, 235, 0.35)',
      badgeClass: 'badge-blue',
      range: '₹10 Cr – ₹100 Cr',
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
    range: '≤ ₹10 Cr',
    isMSME: true,
    description: 'Micro Enterprise'
  };
}
