"use client";
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SemanticSearch = () => {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    if (!url.trim() || !query.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/semantic-search", {
        url,
        query,
      });
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching semantic search results:", error);
      setResults({ error: "Failed to fetch results." });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold text-center">🔍 Semantic Search</h2>

      <Card className="p-6 shadow-lg bg-white rounded-lg space-y-4">
        {/* Input Fields */}
        <Input 
          placeholder="Enter URL..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <Input 
          placeholder="Enter query..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <Button onClick={fetchResults} disabled={loading} className="bg-indigo-500 hover:bg-indigo-700 text-white w-full">
          {loading ? "Searching..." : "Search"}
        </Button>
      </Card>

      {/* Display Results */}
      {results && (
        <div className="space-y-6">
          {/* Matched URL Posts */}
          {results.matched_url_posts && (
            <Card className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">🔗 Matched URL Posts</h3>
              {results.matched_url_posts.map((post: any, index: number) => (
                <div key={index} className="mt-2 p-3 border rounded-lg bg-white">
                  <p className="font-bold">{post.title}</p>
                  <p className="text-gray-700">{post.selftext}</p>
                  <a href={post.url} target="_blank" className="text-blue-500 underline">
                    View Post
                  </a>
                </div>
              ))}
            </Card>
          )}

          {/* Semantic Search Results */}
          {results.semantic_results && (
            <Card className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">🧠 Similar Posts (Semantic Search)</h3>
              {results.semantic_results.map((post: any, index: number) => (
                <div key={index} className="mt-2 p-3 border rounded-lg bg-white">
                  <p className="font-bold">{post.title}</p>
                  <p className="text-gray-700">{post.selftext}</p>
                  <a href={post.url} target="_blank" className="text-blue-500 underline">
                    View Post
                  </a>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;