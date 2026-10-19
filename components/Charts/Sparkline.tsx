"use client";
import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export const Sparkline: React.FC<{ data: { x: string; y: number }[] }> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 60 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="y" stroke="#06b6d4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default Sparkline;