import React from "react";
import { QueryClientProvider } from "./QueryClient";
import { Router } from "./Router";

const Providers = () => {
  return (
    <>
      <QueryClientProvider>
        <Router />
      </QueryClientProvider>
    </>
  );
};
export { Providers };
