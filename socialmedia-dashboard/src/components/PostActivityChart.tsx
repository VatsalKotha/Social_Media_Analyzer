"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const PostActivityChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/time-series`)
        .then((response) => {
            console.log("API Response:", response.data); // Debugging
            setData(response.data);
        })
        .catch((error) => console.error("Error fetching data:", error));
}, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Post Activity Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="post_count" stroke="#613CB1" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PostActivityChart;
