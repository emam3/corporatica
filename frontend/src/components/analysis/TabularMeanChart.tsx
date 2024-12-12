import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSetTabularData } from '../../helpers/functions/tabularData';
import { tabularAnalysisResult } from '../../helpers/types/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const TabularMeanChart: React.FC = () => {
    const { chartData, options } = useSetTabularData();
    const statsArray: tabularAnalysisResult = useSelector((state: RootState) => state.apiRequest.tabularAnalysisResult);
    if(!Object.keys(statsArray).length) return;
    
    return <Bar data={chartData} options={options} />;
};

// export default TabularMeanChart;
