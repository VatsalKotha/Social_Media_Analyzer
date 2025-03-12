import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const SentimentChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:8000/sentiment_distribution');
      setData(response.data);
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Sentiment Distribution</h2>
      <Bar data={data} />
    </div>
  );
};

export default SentimentChart;