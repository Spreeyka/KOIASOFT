import { QueryClient } from "react-query";

export const initialDataQuery = () => ({
  queryKey: ["initialData"],
  queryFn: () => fetchData(),
});

const requestBody = {
  query: [
    {
      code: "Boligtype",
      selection: {
        filter: "item",
        values: ["00", "02", "03"],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["KvPris", "Omsetninger"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "all",
        values: ["*"],
      },
    },
  ],
  response: {
    format: "json-stat2",
  },
};

export const fetchData = async () => {
  const apiUrl = "https://data.ssb.no/api/v0/en/table/07241";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const loader = (queryClient: QueryClient) => async () => {
  return await queryClient.fetchQuery(initialDataQuery());
};
