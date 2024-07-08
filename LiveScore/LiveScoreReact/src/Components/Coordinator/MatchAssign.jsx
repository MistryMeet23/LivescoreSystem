import { Card, CardContent, CardMedia, Typography, Box, Button, Tooltip, Fab } from '@mui/material';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../ProtectedRoute';

const MatchAssign = ({ matchDate, athleteRedImg, athleteBlueImg, athleteRedName, athleteBlueName, matchGroup, mid }) => {
  const formattedDate = dayjs(matchDate).format('MMM D, YYYY');
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(`/coordinator/GenerateOtp/${mid}/${matchGroup}`)
  }

  return (
    <Card sx={{ maxWidth: 300, maxHeight: 230, borderRadius: "7px", mx: 1, color: "black", backgroundColor: "#eceff1" }}>
      <CardContent sx={{ alignItems: "center" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div" color="black">
            LiveScore
          </Typography>
          <Typography variant="body2" component="div" color="black">
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
            <Typography variant="body2" color="black">
              {athleteRedName}
            </Typography>
          </Box>
          <Typography variant="h4" component="div" color="black">
            V/S
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <CardMedia
              component="img"
              image={`/images/${athleteBlueImg}`}
              alt="Athlete Blue"
              sx={{ height: '9vh', width: '9vh', clipPath: 'circle()', mb: 2 }}
            />
            <Typography variant="body2" color="black">
              {athleteBlueName}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-around" alignItems="center" mb={1}>
          <Tooltip title="View Details">
            <Link to={`/coordinator/viewpage/${mid}`} >
              <Button variant="contained" size="small" color="primary" sx={{ fontSize: '0.75rem', mr: 1 }}>
                View
              </Button>
            </Link>
          </Tooltip>
          <Box>
            <Button
              aria-label=""
              variant="contained"
              color="success"
              size="small"
              onClick={handleNavigate}
            >
              OTP
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProtectedRoute(MatchAssign,"coordinator");
