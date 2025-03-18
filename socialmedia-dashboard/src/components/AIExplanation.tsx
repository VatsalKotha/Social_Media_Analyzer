"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import axios from "axios";

const AIExplanation = ({ endpoint, title }: { endpoint: string; title: string }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchExplanation = async () => {
    setLoading(true);
    setOpen(true);
    try {
      console.log(`Fetching from: http://127.0.0.1:8003${endpoint}`); // ✅ Debugging
      const response = await axios.get(`http://127.0.0.1:8003${endpoint}`);
      console.log("Response Data:", response.data); // ✅ Log response
      setInsight(response.data.insight);
    } catch (error) {
      console.error("Error fetching explanation:", error); // ✅ Log error
      setInsight("Failed to fetch insights. Please check the API.");
    }
    setLoading(false);
  };
  

  return (
    <>
      <Button onClick={fetchExplanation} className="bg-indigo-500 hover:bg-indigo-700">
        Key Insights
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        {loading ? <p>Loading...</p> : <p className="p-4">{insight}</p>}
      </Modal>
    </>
  );
};

export default AIExplanation;
