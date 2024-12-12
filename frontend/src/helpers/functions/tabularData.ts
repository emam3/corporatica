import { useSelector } from "react-redux";
import { tabularAnalysisResult } from "../types/api";
import { RootState } from "../../redux/store";

export const useSetTabularData = () => { 
  // Array of statistical data
  const statsArray: tabularAnalysisResult = useSelector((state: RootState) => state.apiRequest.tabularAnalysisResult);
    
  // Prepare labels and datasets
  const labels = Object.keys(statsArray); // X-axis labels (e.g., "5", "16", "17")
  const dataValues = Object.values(statsArray);



  const chartData = {
      labels, // X-axis labels
      datasets: [
          // Basic stats
          {
              label: 'Max',
              data: dataValues.map((item) => item?.basic_stats?.max),
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
          },
          {
              label: 'Mean',
              data: dataValues.map((item) => item?.basic_stats?.mean),
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
          },
          {
              label: 'Median',
              data: dataValues.map((item) => item?.basic_stats?.median),
              backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green
          },
          {
              label: 'Min',
              data: dataValues.map((item) => item?.basic_stats?.min),
              backgroundColor: 'rgba(255, 206, 86, 0.6)', // Yellow
          },
          {
              label: 'Mode',
              data: dataValues.map((item) => item?.basic_stats?.mode),
              backgroundColor: 'rgba(153, 102, 255, 0.6)', // Purple
          }
      ],
  };


  // Chart options
  const options = {
      responsive: true,
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Groups',
              },
          },
          y: {
              beginAtZero: true,
              title: {
                  display: true,
                  text: 'Values',
              },
          },
      },
      plugins: {
          legend: {
              display: true,
              position: 'top',
          },
      },
  };

  return { chartData, options };
}

export const useSetTabularBoxPlotData = () => {
  // Object storing the stats data
  const statsArray: tabularAnalysisResult = useSelector((state: RootState) => state.apiRequest.tabularAnalysisResult);


  // Extract labels and data for the box plot
  const labels = Object.keys(statsArray); // X-axis labels (e.g., "5", "16", "17")
  const data = labels.map((label) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stats: any = statsArray[label];
    const { quartiles, basic_stats, outliers } = stats;

    return {
      min: basic_stats.min,
      q1: quartiles.Q1,
      median: quartiles.Q2,
      q3: quartiles.Q3,
      max: basic_stats.max,
      outliers,
    };
  });

  // Prepare the chart data
  const chartData = {
    labels, // X-axis labels
    datasets: [
      {
        label: 'Box Plot',
        data: data.map((item) => [item.min, item.q1, item.median, item.q3, item.max]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)', // Blue
        borderWidth: 1,
      },
    ],
  };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Groups',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Values',
            },
          },
        },
      };

  return { chartData, options };
}