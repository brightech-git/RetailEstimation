import React, { createContext, useContext, useState } from "react";

const PurchaseContext = createContext(null);

export const PurchaseProvider = ({ children }) => {
  const [savedRows, setSavedRows] = useState([]);

  const savePurchaseRows = (rows) => setSavedRows(rows);
  const clearPurchaseRows = () => setSavedRows([]);

  return (
    <PurchaseContext.Provider value={{ savedRows, savePurchaseRows, clearPurchaseRows }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);
