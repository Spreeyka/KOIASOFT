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
