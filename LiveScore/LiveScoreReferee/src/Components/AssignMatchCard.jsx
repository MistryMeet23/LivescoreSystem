import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import EnterOtp from './EnterOtp';
import { Visibility } from '@mui/icons-material';


const AssignMatchCard = ({ matchDate, athleteRedImg, athleteBlueImg, athleteRedName, athleteBlueName, matchGroup }) => {
    const formattedDate = dayjs(matchDate).format('MMM D, YYYY');
    return (
        <Card sx={{ maxWidth: 300, maxHeight: 220, borderRadius: "7px", mx: 1, color: "#F5F5DC", backgroundColor: "#141c33" }}>
            <CardContent sx={{ alignItems: "center" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="div" color="white">
                        LiveScore
                    </Typography>
                    <Typography variant="body2" component="div" color="white">
                        {formattedDate}
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CardMedia
                            component="img"
                            image={`/images/${athleteRedImg}`}
                            alt="Athlete Red"
                            sx={{ height: '9vh', width: '9vh', clipPath: 'circle()', mb: 1 }}
                        />
                        <Typography variant="body2" color="white" mb={1}>
                            {athleteRedName}
                        </Typography>
                            <Button variant="contained" size="small" startIcon={<Visibility />} sx={{ backgroundColor: "#060c1f", '&:hover': { backgroundColor: "#141c33" } }} >
                                View
                            </Button>
                    </Box>
                    <Typography variant="h4" component="div" color="white">
                        V/S
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CardMedia
                            component="img"
                            image={`/images/${athleteBlueImg}`}
                            alt="Athlete Blue"
                            sx={{ height: '9vh', width: '9vh', clipPath: 'circle()', mb: 1 }}
                        />
                        <Typography variant="body2" color="white" mb={1}>
                            {athleteBlueName}
                        </Typography>
                        <EnterOtp matchGroup={matchGroup}/>
                    </Box>
                </Box>
               
            </CardContent>
        </Card>
    );
};

export default AssignMatchCard;
