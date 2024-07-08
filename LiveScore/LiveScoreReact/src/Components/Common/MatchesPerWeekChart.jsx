import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import ProtectedRoute from '../../ProtectedRoute';
import globalRoute from '../../Redux/GlobalRoute';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MatchesPerWeekChart = ({ month, year }) => {
  const [linedata, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await globalRoute.get(`/Common/matchesPerWeek/${month}/${year}`);
        setLineData(data);
      } catch (error) {
        console.error('Error fetching match data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: linedata.map(item => `Week ${item.week}`),
    datasets: [
      {
        label: 'Match Count',
        data: linedata.map(item => item.matchCount),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Matches Per Week in ${month}/${year}`,
      },
    },
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" paddingTop="5%">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" component="h2" gutterBottom>
            Matches Per Week in {month}/{year}
          </Typography>
          <Line data={chartData} options={options} />
        </>
      )}
    </Box>
  );
};

export default MatchesPerWeekChart;
