import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider as ReactQueryProvider } from 'react-query';

const queryClient = new QueryClient();

type QueryClientProviderProps = {
  children: ReactNode;
};

const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>;
};
export { QueryClientProvider };
