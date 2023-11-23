import { QueryClient } from "react-query";

export interface RequestBody {
  query: QueryItem[];
  response: {
    format: string;
  };
}

interface QueryItem {
  code: string;
  selection: {
    filter: string;
    values: (string | undefined)[];
  };
}

export const fetchDwellingPrices = async (requestBody: RequestBody) => {
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

export const createPricingRequestBody = (selectedDwellingTypeId: string | undefined, quartersRange: string[]) => ({
  query: [
    {
      code: "Boligtype",
      selection: {
        filter: "item",
        values: [selectedDwellingTypeId],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["KvPris"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: [...quartersRange],
      },
    },
  ],
  response: {
    format: "json-stat2",
  },
});

function generateQuarters(startQuarter: string, endQuarter: string) {
  const quarters = [];
  const startYear = parseInt(startQuarter.slice(0, 4), 10);
  const endYear = parseInt(endQuarter.slice(0, 4), 10);
  const startQuarterNumber = parseInt(startQuarter.slice(-1), 10);
  const endQuarterNumber = parseInt(endQuarter.slice(-1), 10);

  for (let year = startYear; year <= endYear; year++) {
    const start = year === startYear ? startQuarterNumber : 1;
    const end = year === endYear ? endQuarterNumber : 4;

    for (let quarter = start; quarter <= end; quarter++) {
      const quarterString = `${year}K${quarter}`;
      quarters.push(quarterString);
    }
  }

  return quarters;
}

interface SearchParams {
  dwellingType: string;
  fromYear: string;
  fromQuarter: string;
  toYear: string;
  toQuarter: string;
}

// Przekażmy mapę jako prop, żeby to ładnie wyświetlić
// naprawić typescript

export const dwellingPricesQuery = (requestBody: RequestBody) => ({
  queryKey: ["dwellingPrices"],
  queryFn: () => fetchDwellingPrices(requestBody),
});

export const dwellingPricesLoader =
  (queryClient: QueryClient) =>
  // @ts-ignore
  async ({ params }) => {
    const { dwellingType, fromYear, fromQuarter, toYear, toQuarter } = params;
    const start = `${fromYear}${fromQuarter}`;
    const end = `${toYear}${toQuarter}`;

    const quartersRange = generateQuarters(start, end);
    console.log("quartersRange", quartersRange);
    const requestBody = createPricingRequestBody(dwellingType, quartersRange);
    return await queryClient.fetchQuery(dwellingPricesQuery(requestBody));
  };
