"use client";
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const AIAnalyzer = () => {
  const [query, setQuery] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setInsights("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/generate-ai-insights", { query });
      setInsights(response.data.insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setInsights("Failed to fetch insights. Try again later.");
    }

    setLoading(false);
  };

  return (
    <Card className="w-full p-6 shadow-lg bg-white rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">📊 AI-Powered Analyzer</h2>
      <Input
        className="p-2 border rounded-lg w-full"
        placeholder="Enter a search query (e.g., AI trends, misinformation)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex justify-center mt-4">
        <Button onClick={fetchInsights} disabled={loading} className="bg-indigo-500 hover:bg-indigo-700">
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Insights"}
        </Button>
      </div>
      <Textarea className="mt-4 p-3 border rounded-lg w-full min-h-[200px]" value={insights} readOnly />
    </Card>
  );
};

export default AIAnalyzer;
