// All API endpoint paths — single source of truth
const ENDPOINTS = {
  // GET
  LIST:                     "/list",
  ESTIMATION_TOTAL:         "/estimationTotal",
  TAG_DETAILS:              "/tag-details",
  TRANNO:                   "/tranno",
  EST_BATCH_NO:             "/estbatchno",
  STN_INPUTS:               "/stnInputs",
  STONE_CATCODE:            "/stone-catcode",
  TAG_DETAILS_BY_TAGNO:     (tagNo) => `/tagDetails/${tagNo}`,
  TRAN_DATE:                "/trandate",
  GENERATE_ESTISSSTONE_SNO: "/generate-estissstone-sno",
  GENERATE_ESTTAXTRAN_SNO:  "/generate-esttaxtran-sno",
  TAX_DETAILS:              (itemId) => `/getEstTaxTranDetails/${itemId}`,
  EST_DETAILS:              (tranno) => `/details/${tranno}`,
  TODAY_RATE:               "/todayrate",
  IP_ADDRESS:               "/ipaddress",
  PRINT_DETAILS:            (estBatchNo) => `/printDetails/${estBatchNo}`,

  // POST
  EST_ISSUE:                "/estissue",
  EST_STN_ISSUE:            "/eststnissue",
  EST_TAX_TRAN:             "/estTaxTran",
  UPDATE_TRANNO:            "/updateTranno",
  OFFER:                    "/offer",
  OFFER_NAME:               "/offer/offerName",
  EST_PRINT:                "/estprint",

  SOFT_CONTROL:            "/soft-control",
  EMPLOYEES:               (search) => `/employees?search=${search}`,
  PRINTER_GET:              "/printers/get",
  PRINTER_BY_EMP:           "/printers/by-emp",
  PRINTER_CREATE:           "/printers/create",
  PRINTER_UPDATE:           "/printers/update",
  PRINTER_DELETE:           "/printers/delete",

  // ITEM TAG (Src-3)
  ITEMTAG_FILTER:           "/itemtag/filter",
  ITEMTAG_UPDATE_CHECK:     "/itemtag/updateCheck",
  ITEMTAG_NAMES:            "/itemtag/itemnames-with-subitems",
  METAL_NAMES:              "/metalnames",
  COUNTER_NAMES:            "/itemctrnames",
};

export default ENDPOINTS;
