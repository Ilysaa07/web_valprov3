// --- Helpers for Price Formatting ---

export const formatNumber = (num) => {
  if (num === null || num === undefined) return "";
  return num.toLocaleString("id-ID");
};

export const parseNumber = (str) => {
  if (!str) return 0;
  // Remove dots and convert to integer
  const cleanStr = str.toString().replace(/\./g, "");
  const num = parseInt(cleanStr, 10);
  return isNaN(num) ? 0 : num;
};

export const validateTerminAmount = (termins, totalInvoice) => {
  const totalTerminAmount = termins.reduce((sum, termin) => {
    if (termin.amountType === "percentage") {
      return sum + (Number(termin.value || 0) / 100) * totalInvoice;
    } else {
      return sum + Number(termin.value || 0);
    }
  }, 0);
  
  return {
    isValid: totalTerminAmount <= totalInvoice,
    totalTerminAmount: Math.round(totalTerminAmount),
    remainingAfterTermin: Math.max(0, totalInvoice - totalTerminAmount)
  };
};