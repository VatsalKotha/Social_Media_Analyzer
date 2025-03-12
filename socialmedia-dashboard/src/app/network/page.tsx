"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function NetworkGraph() {
  const [graphUrl, setGraphUrl] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/network")
      .then((response) => response.text())
      .then(() => setGraphUrl("http://localhost:8000/network"));
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="p-4">
          {graphUrl ? (
            <iframe
              src={graphUrl}
              className="w-full h-[600px] border rounded-lg shadow-md"
            />
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
