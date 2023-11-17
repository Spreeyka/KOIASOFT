import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface PriceValue {
  date: string;
  price: number;
}

interface SimpleBarChartProps {
  priceValuesByDate: PriceValue[];
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ priceValuesByDate }) => {
  return (
    <BarChart width={600} height={400} data={priceValuesByDate} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="price" fill="#8884d8" />
    </BarChart>
  );
};

export { SimpleBarChart };
