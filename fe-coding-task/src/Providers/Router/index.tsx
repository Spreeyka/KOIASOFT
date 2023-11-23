import React from "react";
import { QueryClient } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DwellingPricesForm } from "../../Form";
import { SimpleBarChart } from "../../Chart";
import { loader } from "../../Form/dataLoaders/initialDataLoader";
import { Layout } from "../../Layout";
import { ErrorPage } from "../../ErrorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <DwellingPricesForm />
      </Layout>
    ),
    loader: loader(queryClient),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
  {
    path: "/prices/:dwellingType/:fromYear/:fromQuarter/:toYear/:toQuarter",
    element: (
      <Layout>
        <SimpleBarChart />
      </Layout>
    ),
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};
export { Router };
