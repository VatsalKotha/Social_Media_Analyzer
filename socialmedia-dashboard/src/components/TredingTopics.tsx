// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { RefreshCw, TrendingUp } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
//   PieChart,
//   Pie,
// } from "recharts";

// const COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#845EC2",
//   "#D65DB1",
//   "#FF6F91",
// ];

// // Define the structure of topic data
// interface TopicData {
//   topic: string;
//   count: number;
//   percentage?: string;
// }

// const TopicTrends: React.FC = () => {
//   const [topicsData, setTopicsData] = useState<TopicData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [visualizationType, setVisualizationType] = useState<"bar" | "pie">(
//     "bar"
//   );

//   useEffect(() => {
//     fetch("http://127.0.0.1:8003/api/topic-trends")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.message) {
//           setTopicsData([]);
//         } else {
//           setTopicsData(data);
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setError("Failed to load data.");
//         setLoading(false);
//       });
//   }, []);

//   // Process data to include percentages
//   const processedData: TopicData[] = (() => {
//     const totalCount = topicsData.reduce((sum, item) => sum + item.count, 0);
//     return topicsData.map((item) => ({
//       ...item,
//       percentage:
//         totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : "0",
//     }));
//   })();

//   // Bar Chart
//   const renderBarChart = () => (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={processedData}>
//         <XAxis dataKey="topic" angle={-45} textAnchor="end" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="count" name="Count:">
//           {processedData.map((_, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );

//   // Pie Chart
//   const renderPieChart = () => (
//     <ResponsiveContainer width="100%" height={400}>
//       <PieChart>
//         <Pie
//           data={processedData}
//           cx="50%"
//           cy="50%"
//           labelLine
//           outerRadius={130}
//           innerRadius={60}
//           fill="#8884d8"
//           dataKey="count"
//           nameKey="topic"
//           label={({ name, percent }) =>
//             `${name}: ${(percent * 100).toFixed(1)}%`
//           }
//         >
//           {processedData.map((_, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <TrendingUp className="h-5 w-5" />
//           Trending Topics
//         </CardTitle>
//         <CardDescription>
//           Most discussed topics in the selected timeframe
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
//           </div>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : topicsData.length === 0 ? (
//           <p>No trending topics found.</p>
//         ) : (
//           <>
//             <div className="flex gap-4 mb-4">
//               <button
//                 className={`px-4 py-2 rounded-md ${
//                   visualizationType === "bar"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => setVisualizationType("bar")}
//               >
//                 Bar Chart
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-md ${
//                   visualizationType === "pie"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200"
//                 }`}
//                 onClick={() => setVisualizationType("pie")}
//               >
//                 Pie Chart
//               </button>
//             </div>
//             {visualizationType === "bar" ? renderBarChart() : renderPieChart()}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TopicTrends;


"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RefreshCw, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#D65DB1",
  "#FF6F91",
];

// Define the structure of topic data
interface TopicData {
  topic: string;
  count: number;
  percentage?: string;
}

const TopicTrends: React.FC = () => {
  const [topicsData, setTopicsData] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<"bar" | "pie">(
    "bar"
  );

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_CHATBOT_API_URL}/api/topic-trends`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setTopicsData([]);
        } else {
          setTopicsData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data.");
        setLoading(false);
      });
  }, []);

  // Process data to include percentages
  const processedData: TopicData[] = (() => {
    const totalCount = topicsData.reduce((sum, item) => sum + item.count, 0);
    return topicsData.map((item) => ({
      ...item,
      percentage:
        totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : "0",
    }));
  })();

  // Bar Chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={processedData}
        margin={{ top: 20, right: 30, left: 50, bottom: 100 }}
      >
        <XAxis dataKey="topic" angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend
          formatter={(value) => `Topic: ${value}`} // Add "Topic:" prefix to legend items
        />
        <Bar dataKey="count" name="Trending Topics"> {/* Set name to "Topics" */}
          {processedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Pie Chart
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine
          outerRadius={130}
          innerRadius={60}
          fill="#8884d8"
          dataKey="count"
          nameKey="topic"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
        >
          {processedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value) => `Topic: ${value}`} // Add "Topic:" prefix to legend items
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
        </CardTitle>
        <CardDescription>
          Most discussed topics in the selected timeframe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : topicsData.length === 0 ? (
          <p>No trending topics found.</p>
        ) : (
          <>
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  visualizationType === "bar"
                    ? "bg-indigo-500 hover:bg-indigo-700 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setVisualizationType("bar")}
              >
                Bar Chart
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  visualizationType === "pie"
                    ? "bg-indigo-500 hover:bg-indigo-700 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setVisualizationType("pie")}
              >
                Pie Chart
              </button>
            </div>
            {visualizationType === "bar" ? renderBarChart() : renderPieChart()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicTrends;