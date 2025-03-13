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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";

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
      <h2 className="text-lg font-semibold">🔥 Post Score Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#2D8A59"> {/* ✅ Changed to darker green */}
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreDistribution;
