import { FiberManualRecord } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const MatchCard = ({matchGroup,mid, matchDate, athleteRedImg, athleteBlueImg, athleteRedName, athleteBlueName ,matchStatus }) => {
  const formattedDate = dayjs(matchDate).format(' MMM D, YYYY');
  const cardContent = (
    <Card sx={{ maxWidth: 300, maxHeight: 200, borderRadius: "7px", mx: 1, color: "black", backgroundColor: "#eceff1" }}>
      <CardContent sx={{ alignItems: "center" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div" color="black">
            LiveScore
          </Typography>
          <Typography variant="body2" component="div" color="black">
            {matchStatus === "Live" ? (
              <Chip label={matchStatus} color="success" size='small' icon={<FiberManualRecord />} variant="filled" />
            ) : formattedDate}
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
              sx={{ height: '9vh', width: '9vh', clipPath: 'circle()', mb: 1 }}
            />
            <Typography variant="body2" color="black">
              {athleteBlueName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return matchStatus === "Live" ? (
    <Link to={`/LiveMatch/${mid}/${matchGroup}`} style={{ textDecoration: "none" }}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default MatchCard;
