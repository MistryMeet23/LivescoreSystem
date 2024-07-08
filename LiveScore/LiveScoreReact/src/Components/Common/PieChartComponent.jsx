import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GetCategoryViseAthlete } from '../Apis/Common';
import { Box } from '@mui/material';

const PieChartComponent = () => {
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetCategoryViseAthlete(); // Log fetched data
                setCategoryData(data);
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#5a6bea', '#25abd8', '#913afb'];

    return (
        <Box sx={{ width: { xs: 500, sm: 500, md: 350,lg:450,xl:500  }, height: { xs: 300, sm: 400, md: 300,lg:500,xl:500 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="totalAthletes"
                            nameKey="categoryName"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div>Loading...</div>
            )}
        </Box>
    );
};

export default PieChartComponent;
