// "use client";
// import { useEffect, useState } from "react";
// import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
// import axios from "axios";

// const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#0088FE"];

// const SubredditDistribution = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         axios.get("http://127.0.0.1:8000/subreddit-distribution")
//             .then((response) => setData(response.data))
//             .catch((error) => console.error("Error fetching data:", error));
//     }, []);

//     return (
//         <div className="p-4 bg-white rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold">Community Data</h2>
//             <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                     <Pie data={data} dataKey="count" nameKey="subreddit" cx="50%" cy="50%" outerRadius={100}>
//                         {data.map((_, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                     </Pie>
//                     <Tooltip />
//                 </PieChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default SubredditDistribution;

"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#0088FE"];

const SubredditDistribution = () => {
    const [data, setData] = useState<{ subreddit: string; count: number }[]>([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/subreddit-distribution")
            .then((response) => setData(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex">
            {/* Pie Chart Section */}
            <div className="w-2/3">
                <h2 className="text-lg font-semibold mb-2">Community Data</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data} dataKey="count" nameKey="subreddit" cx="50%" cy="50%" outerRadius={100}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend Section */}
            <div className="w-1/3 flex flex-col justify-center items-start pl-6">
                <h3 className="text-md font-semibold mb-2">Legend</h3>
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-1">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm">{entry.subreddit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubredditDistribution;
