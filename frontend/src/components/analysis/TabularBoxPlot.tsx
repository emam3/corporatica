import { BoxAndWiskers, BoxPlotController } from '@sgratzl/chartjs-chart-boxplot';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import { useSetTabularBoxPlotData } from '../../helpers/functions/tabularData';
import { tabularAnalysisResult } from '../../helpers/types/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, BoxPlotController, BoxAndWiskers);

export const TabularBoxPlot: React.FC = () => {
  const { chartData, options } = useSetTabularBoxPlotData();

  const statsArray: tabularAnalysisResult = useSelector((state: RootState) => state.apiRequest.tabularAnalysisResult);
  if (!Object.keys(statsArray).length) return;
  return <Chart type="boxplot" data={chartData} options={options} />;
};
