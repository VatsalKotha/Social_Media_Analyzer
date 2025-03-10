import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [posts, setPosts] = useState("");
  const [insights, setInsights] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle generating insights
  const handleGenerateInsights = async () => {
    if (!posts.trim()) {
      toast.error("Please enter some posts to analyze.");
      return;
    }

    setLoading(true);
    try {
      const postList = posts.split("\n").filter((post) => post.trim() !== "");
      const response = await axios.post("http://localhost:8000/analyze/insights", {
        posts: postList,
      });
      setInsights(response.data);
      toast.success("Insights generated successfully!");
    } catch (err) {
      toast.error("Failed to generate insights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle semantic search
  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/search/semantic", {
        query: searchQuery,
        top_k: 5,
      });
      setSearchResults(response.data);
      toast.success("Search completed successfully!");
    } catch (err) {
      toast.error("Failed to perform semantic search. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Social Media Analysis Dashboard</h1>
      <ToastContainer />

      {/* Insights Section */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Generate Insights</h2>
        <textarea
          rows="10"
          cols="50"
          placeholder="Enter social media posts (one per line)"
          value={posts}
          onChange={(e) => setPosts(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
        <br />
        <button
          onClick={handleGenerateInsights}
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {loading ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            "Generate Insights"
          )}
        </button>

        {insights && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>Insights</h3>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
              {JSON.stringify(insights, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Semantic Search Section */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Semantic Search</h2>
        <input
          type="text"
          placeholder="Enter search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
        <br />
        <button
          onClick={handleSemanticSearch}
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: loading ? "#ccc" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {loading ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            "Search"
          )}
        </button>

        {searchResults.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>Search Results</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                  <strong>User:</strong> {result.user || "Unknown"}<br />
                  <strong>Timestamp:</strong> {result.timestamp ? new Date(result.timestamp).toLocaleString() : "N/A"}<br />
                  <strong>Content:</strong> {result.content || "No content available"}<br />
                  <strong>Semantic Score:</strong> {result.semantic_score ? result.semantic_score.toFixed(2) : "N/A"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;