// Config/useApiBaseUrl.js
import { useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';

export const useApiBaseUrl = () => {
  const { companyUrl } = useContext(LoginContext);
  return companyUrl;
};
