// Service/StockPasswordUpdateService.js
const BASE_URL = "https://app.bmgjewellers.com/api/v1/company";

export const updateCompanyStockPassword = async ({ stockPassword, id }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/updateCompany?stockPassword=${encodeURIComponent(
        stockPassword
      )}&id=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update stock password");
    }

    return await response.json();
  } catch (error) {
    console.error("Update Company Stock Password Error:", error);
    throw error;
  }
};