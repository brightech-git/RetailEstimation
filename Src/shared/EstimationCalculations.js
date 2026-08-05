// Shared estimation calculation utility — SINGLE SOURCE OF TRUTH.
//
// Used across:
//   - Pre-save UI (Src-1 UseEstimation, HomeScreen, EstimationTable)
//   - Post-save / print flow (EstimationPrinterService, buildReceiptHtml)
//   - Src-2 (Home, ItemDetailCard)
//
// Business rule (confirmed): GST is always fixed at 1.5% CGST + 1.5% SGST
// (3% total). Any per-row/per-item GSTPer field is informational/cosmetic
// only and must NOT be used to compute tax — this matches what is actually
// persisted today (see generateTaxEntries, used by UseEstimation.submitData).

export const GST_RATE = {
  CGST: 1.5,
  SGST: 1.5,
  TOTAL: 3,
};

export const parseValue = (value) => {
  if (!value || value === "null" || value === "undefined") return 0;
  const parsed = parseFloat(String(value).replace(/"/g, "").trim());
  return isNaN(parsed) ? 0 : parsed;
};

// ─── Pre-save UI row calculations ──────────────────────────────────────
// Rows here use the UI table shape: row.NETWT, row.Wastage, row.Rate,
// row.MC, row.StoneAmount, row.MiscAmount, row.DISCOUNT, row.GrossAmount.

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

// GST on discounted gross — always the fixed 1.5% + 1.5% rate (GST_RATE.TOTAL),
// regardless of any row.GSTPer value (informational only, per business rule).
export const calcGST = (row) => {
  const taxable = calcDiscountedGross(row);
  return (taxable * GST_RATE.TOTAL) / 100;
};

// Grand total = discounted gross + GST
export const calcGrandTotal = (row) => calcDiscountedGross(row) + calcGST(row);

// Batch totals from an array of pre-save rows
export const calcTotals = (rows) => {
  const totalDiscount = rows.reduce((acc, r) => acc + (parseFloat(r.DISCOUNT) || 0), 0);
  const totalGross = rows.reduce((acc, r) => acc + calcDiscountedGross(r), 0);
  const totalGST = rows.reduce((acc, r) => acc + calcGST(r), 0);
  return { totalDiscount, totalGross, totalGST, totalGrand: totalGross + totalGST };
};

// ─── Offer discount ─────────────────────────────────────────────────────
// Shared by pre-save fetch (UseEstimation.fetchData), post-save print
// (EstimationPrinterService.fetchEstimationData), and Src-2 Home.fetchApiData.
//
// The /offer endpoint (POST /offer?tagno=...) returns camelCase fields —
// { tagno, itemId, subItemId, netwt, boardRate, discount, finalAmount } —
// NOT the snake_case `board_rate` this codebase used to assume. It also
// already returns a pre-computed, authoritative `discount` amount, so we
// use that directly instead of re-deriving it client-side whenever present.
// `board_rate`/`netwt` fallbacks are kept for any older/other response shape.
export const getOfferBoardRate = (offer) => {
  if (!offer) return 0;
  return parseFloat(offer.boardRate ?? offer.board_rate ?? 0) || 0;
};

export const calcOfferDiscount = (offer) => {
  if (!offer) return 0;
  if (offer.discount != null && offer.discount !== "") {
    const d = parseFloat(offer.discount);
    if (!isNaN(d)) return d;
  }
  return (offer.netwt || 0) * getOfferBoardRate(offer);
};

// ─── Post-save / saved-item (API item) calculations ────────────────────
// Items here use lowercase API field names: item.amount, item.pcs,
// item.grswt, item.wastage, item.mcharge. item.amount is already net of
// offer discount (persisted that way by UseEstimation.submitData).

// Split a taxable amount into fixed CGST/SGST amounts (2-decimal rounded).
export const calcTaxSplit = (taxableAmount) => {
  const cgstAmount = parseFloat(((taxableAmount * GST_RATE.CGST) / 100).toFixed(2));
  const sgstAmount = parseFloat(((taxableAmount * GST_RATE.SGST) / 100).toFixed(2));
  return { cgstAmount, sgstAmount, totalTaxAmount: cgstAmount + sgstAmount };
};

// Totals for a set of already-saved items (post-save/print flow), given the
// offer fetched for the batch. Single source of truth for
// EstimationPrinterService.fetchEstimationData's totals block.
export const calcSavedTotals = (items, offer) => {
  const totalpcs = items.reduce((sum, i) => sum + (i.pcs || 0), 0);
  const totalGrossWeight = items.reduce((sum, i) => sum + (i.grswt || 0), 0);
  const baseAmount = items.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalWastage = items.reduce((sum, i) => sum + (i.wastage || 0), 0);
  const totalMcharge = items.reduce((sum, i) => sum + (i.mcharge || 0), 0);

  const offerDiscount = calcOfferDiscount(offer);
  const grossAmount = baseAmount + offerDiscount; // pre-discount gross
  const taxableAmount = baseAmount; // already discounted
  const { cgstAmount, sgstAmount, totalTaxAmount } = calcTaxSplit(taxableAmount);
  const grandTotal = parseFloat((taxableAmount + totalTaxAmount).toFixed(2));

  // GST on just the discount amount itself (fixed 1.5%/1.5%), exposed
  // separately in case it's needed on its own (e.g. reports/verification)
  // independent of whichever taxable base the receipt ends up using.
  const {
    cgstAmount: discountCgstAmount,
    sgstAmount: discountSgstAmount,
    totalTaxAmount: discountTaxAmount,
  } = calcTaxSplit(offerDiscount);

  return {
    totalpcs,
    totalGrossWeight,
    baseAmount,
    totalWastage,
    totalMcharge,
    offerDiscount,
    grossAmount,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    totalTaxAmount,
    grandTotal,
    discountCgstAmount,
    discountSgstAmount,
    discountTaxAmount,
  };
};

// Display/print-time GST + grand total, gated by the OFFERPRINTGST soft
// control. When the control is 'Y', GST is charged on the discounted
// (offer-applied) amount, same as calcSavedTotals. When it's 'N' (or
// unset) — i.e. the offer line is hidden on the receipt — GST is instead
// calculated on the FULL, pre-discount gross amount, and the grand total
// is gross + GST on that gross amount (the discount is not applied at
// all in that case, not just hidden from view).
export const calcDisplayTotals = (totals, offerPrintGst) => {
  const applyOffer = offerPrintGst === "Y";
  const taxableAmount = applyOffer ? totals.baseAmount : totals.grossAmount;
  const { cgstAmount, sgstAmount, totalTaxAmount } = calcTaxSplit(taxableAmount);
  const grandTotal = parseFloat((taxableAmount + totalTaxAmount).toFixed(2));
  return { taxableAmount, cgstAmount, sgstAmount, totalTaxAmount, grandTotal };
};

// Per-item pro-rated share of the offer discount, for display purposes only
// (e.g. the "displayAmount" shown per line item on the printed slip).
export const calcItemDisplayShare = (item, baseAmount, offerDiscount, itemCount = 1) => {
  const itemShare =
    baseAmount > 0
      ? ((item.amount || 0) / baseAmount) * offerDiscount
      : offerDiscount / (itemCount || 1);
  return (item.amount || 0) + itemShare;
};

// Reverse-extract the fixed-rate GST portion out of a GST-inclusive amount
// (e.g. the offer discount, when the printed slip needs to show it split
// into pre-tax + CGST + SGST components). Uses the fixed GST_RATE.TOTAL.
export const splitInclusiveGst = (inclusiveAmount) => {
  const exclGst = Math.round((inclusiveAmount / (100 + GST_RATE.TOTAL)) * 100);
  const gstTotal = inclusiveAmount - exclGst;
  const gstEach = gstTotal / 2;
  return { exclGst, gstTotal, gstEach };
};

// Build the SGST/CGST tax-tran entries persisted alongside a saved item.
// Always uses the fixed GST_RATE constant — any GSTPer informational field
// on the row is not consulted, matching what is actually persisted today.
export const generateTaxEntries = (payload) => {
  const amt = payload.amount;
  return [
    {
      ...payload,
      taxid: "SG",
      taxper: GST_RATE.SGST,
      taxamount: parseFloat(((amt * GST_RATE.SGST) / 100).toFixed(2)),
      tsno: 1,
    },
    {
      ...payload,
      taxid: "CG",
      taxper: GST_RATE.CGST,
      taxamount: parseFloat(((amt * GST_RATE.CGST) / 100).toFixed(2)),
      tsno: 2,
    },
  ];
};
