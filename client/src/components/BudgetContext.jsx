import React, { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [savedOverallBudget, setSavedOverallBudget] = useState(0);

  return (
    <BudgetContext.Provider value={{ savedOverallBudget, setSavedOverallBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};
