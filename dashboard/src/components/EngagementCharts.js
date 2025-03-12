import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const EngagementChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:8000/engagement_analysis');
      setData(response.data);
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Engagement Over Time</h2>
      <Line data={data} />
    </div>
  );
};

export default EngagementChart;