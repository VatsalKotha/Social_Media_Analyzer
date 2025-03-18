// "use client";
// import { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import axios from "axios";

// const ScoreDistribution = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/score-distribution`)
//             .then((response) => setData(response.data))
//             .catch((error) => console.error("Error fetching data:", error));
//     }, []);

//     return (
//         <div className="p-4 bg-white rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold">Post Score Distribution</h2>
//             <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={data}>
//                     <XAxis dataKey="score" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="score" fill="#82ca9d" />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default ScoreDistribution;

"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";
import AIExplanation from "@/components/AIExplanation";

const COLORS = ["#613CB1", "#2D8A59", "#FFBB28", "#FF8042", "#FF4500"]; // Darker colors

const ScoreDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/score-distribution`)
      .then((response) => {
        console.log("Score Distribution Data:", response.data); // Debugging
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">🔥 Post Score Distribution</h2>
        <AIExplanation endpoint="/score-insight" title="🏆 Score Insights" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={30}>
          <XAxis dataKey="index" stroke="black" strokeWidth={2} />
          <YAxis stroke="black" strokeWidth={2} />
          <Tooltip />
          <Bar dataKey="score" fill="#2D8A59" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    // <div className="p-4 bg-white rounded-lg shadow-md">
    //   <h2 className="text-lg font-semibold">🔥 Post Score Distribution</h2>
    //   <ResponsiveContainer width="100%" height={300}>
    //     <BarChart data={data} barSize={30}> {/* ✅ Increased barSize for thicker bars */}
    //       <XAxis dataKey="index" stroke="black" strokeWidth={2} /> {/* ✅ Bold axis lines */}
    //       <YAxis stroke="black" strokeWidth={2} /> {/* ✅ Bold Y-axis */}
    //       <Tooltip />
    //       <Bar dataKey="score" fill="#2D8A59" radius={[5, 5, 0, 0]}> {/* ✅ Slight rounding for aesthetics */}
    //         {data.map((_, index) => (
    //           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //         ))}
    //       </Bar>
    //     </BarChart>
    //   </ResponsiveContainer>
    // </div>
  );
};

export default ScoreDistribution;
