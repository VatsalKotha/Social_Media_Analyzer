"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import AIExplanation from "@/components/AIExplanation";

const EngagementOverTime = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/engagement-over-time`)
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Engagement Over Time</h2>
        <AIExplanation
          endpoint="/engagement-insight"
          title="💬 Engagement Insights"
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#613CB1" />
          <Line type="monotone" dataKey="num_comments" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    // <div className="p-4 bg-white rounded-lg shadow-md">
    //     <h2 className="text-lg font-semibold">Engagement Over Time</h2>
    //     <ResponsiveContainer width="100%" height={300}>
    //         <LineChart data={data}>
    //             <XAxis dataKey="timestamp" />
    //             <YAxis />
    //             <Tooltip />
    //             <Line type="monotone" dataKey="score" stroke="#613CB1" />
    //             <Line type="monotone" dataKey="num_comments" stroke="#FF8042" />
    //         </LineChart>
    //     </ResponsiveContainer>
    // </div>
  );
};

export default EngagementOverTime;
