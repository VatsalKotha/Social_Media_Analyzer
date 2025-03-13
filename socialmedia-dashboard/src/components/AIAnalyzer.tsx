// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Loader2 } from "lucide-react";

// const AIAnalyzer = () => {
//   const [query, setQuery] = useState("");
//   const [insights, setInsights] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchInsights = async () => {
//     if (!query.trim()) return;
    
//     setLoading(true);
//     setInsights("");

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/generate-ai-insights`, { query });
//       setInsights(response.data.insights);
//     } catch (error) {
//       console.error("Error fetching AI insights:", error);
//       setInsights("Failed to fetch insights. Try again later.");
//     }

//     setLoading(false);
//   };

//   return (
//     <Card className="w-full p-6 shadow-lg bg-white rounded-lg">
//       <h2 className="text-xl font-bold text-center mb-4">📊 AI-Powered Analyzer</h2>
//       <Input
//         className="p-2 border rounded-lg w-full"
//         placeholder="Enter a search query (e.g., AI trends, misinformation)..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <div className="flex justify-center mt-4">
//         <Button onClick={fetchInsights} disabled={loading} className="bg-indigo-500 hover:bg-indigo-700">
//           {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Insights"}
//         </Button>
//       </div>
//       <Textarea className="mt-4 p-3 border rounded-lg w-full min-h-[200px]" value={insights} readOnly />
//     </Card>
//   );
// };

// export default AIAnalyzer;


"use client";
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, MessageCircle, AlertCircle, BarChart3, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIAnalyzer = () => {
  const [query, setQuery] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setInsights("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/generate-ai-insights`, { query });
      setInsights(response.data.insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setInsights("Failed to fetch insights. Try again later.");
    }

    setLoading(false);
  };

  // Function to parse sections based on Markdown-style headers
  const parseSections = (text: string) => {
    const sections: { title: string; content: string }[] = [];
    const lines = text.split("\n");

    let currentTitle = "";
    let currentContent = "";

    lines.forEach((line) => {
      if (line.startsWith("**")) {
        if (currentTitle) {
          sections.push({ title: currentTitle, content: currentContent.trim() });
        }
        currentTitle = line.replace(/\*\*/g, "").trim(); // Remove '**'
        currentContent = "";
      } else {
        currentContent += line + "\n";
      }
    });

    if (currentTitle) {
      sections.push({ title: currentTitle, content: currentContent.trim() });
    }

    return sections;
  };

  return (
    <Card className="w-full p-6 shadow-lg bg-white rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">📊 AI-Powered Analyzer</h2>
      
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          className="p-2 border rounded-lg flex-1"
          placeholder="Enter a search query (e.g., AI trends, crypto, economy)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={fetchInsights} disabled={loading} className="bg-indigo-500 hover:bg-indigo-700">
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Insights"}
        </Button>
      </div>

      {/* Insights Display */}
      {insights && (
        <ScrollArea className="mt-6 max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg border">
          {parseSections(insights).map((section, index) => (
            <Card key={index} className="mb-4 p-4 bg-white shadow-sm rounded-lg border border-gray-300">
              <div className="flex items-center gap-3 mb-2">
                {section.title.includes("Summary") && <FileText className="text-indigo-500" />}
                {section.title.includes("Key Talking Points") && <MessageCircle className="text-green-500" />}
                {section.title.includes("Overall Sentiment Score") && <AlertCircle className="text-red-500" />}
                {section.title.includes("Notable Patterns") && <BarChart3 className="text-blue-500" />}
                {section.title.includes("Recommendations") && <Lightbulb className="text-yellow-500" />}
                
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
            </Card>
          ))}
        </ScrollArea>
      )}
    </Card>
  );
};

export default AIAnalyzer;
