import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Histogram: React.FC = () => {
  // Example data
  const data = useSelector((state: RootState) => state.apiRequest.imageAnalysisResult.histogramData);
  const responseDataExists: boolean = data.blue.length > 0;
  if(!responseDataExists) return null;

  // Prepare data for Chart.js
  const chartData = {
    labels: Array.from({ length: 256 }, (_, i) => i), // Intensity levels 0-255
    datasets: [
      {
        label: 'Blue',
        data: data.blue,
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Semi-transparent blue
      },
      {
        label: 'Green',
        data: data.green,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Semi-transparent green
      },
      {
        label: 'Red',
        data: data.red,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Semi-transparent red
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Intensity Levels (0-255)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default Histogram;