
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/company/getByCredentials", // uses the AUTH backend
  },

  COST: {
    LIST: "/costId",
  },

  ESTIMATION: {
    ITEM_LIST: "/list",
    GET_ESTIMATION: "/estimationTotal",
    TAG_DETAILS: "/tag-details",
    TRAN_NO: "/tranno",
    BATCH_NO: "/estbatchno",
    STONE_INPUTS: "/stnInputs",
    STONE_CATCODE: "/stone-catcode",
    TRAN_DATE: "/trandate",
    GEN_STONE_SNO: "/generate-estissstone-sno",
    GEN_TAX_SNO: "/generate-esttaxtran-sno",
    TAX_DETAILS: "/getEstTaxTranDetails", // + `/${itemId}`
    SAVE_ISSUE: "/estissue",
    SAVE_STONE_ISSUE: "/eststnissue",
    SAVE_TAX: "/estTaxTran",
    SAVE_OFFER: "/offer",
    UPDATE_TRAN_NO: "/updateTranno",
    PRINT: "/estprint",
  },

  RATE: {
    TODAY_RATE: "/todayrate",
  },

  TAG: {
    GET_TAG: "/tagDetails", // + `/${tagNo}`
  },

  STOCK: {
    SEARCH: "/itemtag/filter",
    METAL_NAMES: "/metalnames",
    COUNTER_NAMES: "/itemctrnames",
    ITEMS_WITH_SUBITEMS: "/itemtag/itemnames-with-subitems",
  },

  PRINTER: {
    GET: "/printers/get",
    BY_EMP: "/printers/by-emp",
    CREATE: "/printers/create",
    UPDATE: "/printers/update",
    DELETE: "/printers/delete",
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
