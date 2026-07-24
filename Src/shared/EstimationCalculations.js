// Shared estimation calculation utility
// Used by Src-1 (UseEstimation, HomeScreen) and Src-2 (ItemDetailCard)

export const parseValue = (value) => {
  if (!value || value === "null" || value === "undefined") return 0;
  const parsed = parseFloat(String(value).replace(/"/g, "").trim());
  return isNaN(parsed) ? 0 : parsed;
};

// Raw gross from API or computed from tag fields
export const calcGross = (row) => {
  const grossFromApi = parseValue(row.GrossAmount);
  if (grossFromApi > 0) return grossFromApi;
  const netWt = parseValue(row.NETWT);
  const wastage = parseValue(row.Wastage);
  const rate = parseValue(row.Rate);
  const mc = parseValue(row.MC);
  const stoneAmt = parseValue(row.StoneAmount);
  const miscAmt = parseValue(row.MiscAmount);
  return (netWt + wastage) * rate + mc + stoneAmt + miscAmt;
};

// Gross after offer discount (taxable base)
export const calcDiscountedGross = (row) => {
  return calcGross(row) - (parseFloat(row.DISCOUNT) || 0);
};

// GST on discounted gross
export const calcGST = (row) => {
  const taxable = calcDiscountedGross(row);
  const gstPer = parseFloat(row.GSTPer) || 3; // default 1.5% CGST + 1.5% SGST
  return (taxable * gstPer) / 100;
};

// Grand total = discounted gross + GST
export const calcGrandTotal = (row) => calcDiscountedGross(row) + calcGST(row);

// Batch totals from an array of rows
export const calcTotals = (rows) => {
  const totalDiscount = rows.reduce((acc, r) => acc + (parseFloat(r.DISCOUNT) || 0), 0);
  const totalGross = rows.reduce((acc, r) => acc + calcDiscountedGross(r), 0);
  const totalGST = rows.reduce((acc, r) => acc + calcGST(r), 0);
  return { totalDiscount, totalGross, totalGST, totalGrand: totalGross + totalGST };
};
