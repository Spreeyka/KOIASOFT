interface TransformedObject {
  [year: string]: {
    quartersAvailable: string[];
  };
}

export function transformArray(originalArray: string[]): TransformedObject {
  return originalArray.reduce((acc, item) => {
    const matchResult = item.match(/(\d{4})K(\d)/);

    if (matchResult) {
      const [year, quarter] = matchResult.slice(1) as [string, string]; // Extract year and quarter
      if (!acc[year]) {
        acc[year] = { quartersAvailable: [] };
      }
      acc[year].quartersAvailable.push(`K${quarter}`);
    }

    return acc;
  }, {} as TransformedObject);
}
