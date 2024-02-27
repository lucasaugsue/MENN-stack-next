import React, { createContext, useMemo } from 'react';
import serverRequest from '../service/RestClient';


let ClientContext;

if (typeof window !== 'undefined') {
  // createContext só deve ser chamado no lado do cliente
  ClientContext = createContext();
} else {
  // Se estivermos no servidor, fornecemos um contexto vazio
  ClientContext = React.createContext({});
}

const ClientContextProvider = ({ children }) => {
  const clientContext = useMemo(() => ({
    apiRequest: (method, url, params, downloadFile, { contentType = undefined } = {}) =>
      serverRequest({ method, url, params, downloadFile, contentType }),
  }), []);

  return (
    <ClientContext.Provider value={clientContext}>
      {children}
    </ClientContext.Provider>
  );
};

export { ClientContext, ClientContextProvider };
