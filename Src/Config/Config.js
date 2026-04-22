// Config/useApiBaseUrl.js
import { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';

export const useApiBaseUrl = () => {
  const { companyUrl } = useContext(LoginContext);
  return companyUrl;
};

// export const API_BASE_URL_COSTID = "http://192.168.0.10:8082/api/v1";