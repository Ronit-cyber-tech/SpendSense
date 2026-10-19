"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#06b6d4", "#0f766e", "#ef4444", "#f59e0b", "#6366f1", "#10b981"];

export const PieByCategory: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={3}>
            {data.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PieByCategory;