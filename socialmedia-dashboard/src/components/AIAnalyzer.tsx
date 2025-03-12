"use client";
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react"; // Use this as a spinner

const AIAnalyzer = () => {
    const [insights, setInsights] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/generate-ai-insights");
            setInsights(response.data.insights);
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            setInsights("Failed to fetch insights. Try again later.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
            <Card className="w-full max-w-2xl p-6 shadow-2xl bg-white rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    📊 AI-Powered Social Media Analyzer
                </h2>

                <p className="text-gray-600 text-center mb-4">
                    Click the button below to analyze social media trends using Llama 3-8B.
                </p>

                <div className="flex justify-center">
                    <Button onClick={fetchInsights} disabled={loading} className="bg-indigo-500 hover:bg-indigo-700 transition-all flex items-center">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Insights"}
                    </Button>
                </div>

                <Textarea
                    className="mt-4 p-3 border rounded-lg w-full min-h-[150px] bg-gray-100"
                    value={insights}
                    readOnly
                    placeholder="AI-generated insights will appear here..."
                />
            </Card>
        </div>
    );
};

export default AIAnalyzer;
