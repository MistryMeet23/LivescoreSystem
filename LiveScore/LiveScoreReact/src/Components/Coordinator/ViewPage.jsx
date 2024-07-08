import { Box, Typography, Grid, Card, CardContent, CardMedia, TableContainer, Table,  TableRow, TableCell, TableBody, Paper, Chip,  IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { GetMatchById } from '../Apis/Coordinator';
import vs from '../Images/vs.png'
import { ArrowBack, Category, DateRangeRounded, EmojiEventsRounded, Groups2, Groups3, LocationCity, ModeStandbyRounded, SportsGymnasticsRounded } from '@mui/icons-material';

const ViewPage = () => {

  const { mid } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const navigate = useNavigate()
  const img_url = "http://localhost:5032/images/";

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const {data} = await GetMatchById(mid);
        setMatchDetails(data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };
    fetchMatchDetails();
  }, [mid]);

  if (!matchDetails) {
    return <Typography>Loading...</Typography>;
  }

  const HandleonClick = () => {
     navigate("/coordinator/cDashboard")
  }
  

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <IconButton color='default'  onClick={() => HandleonClick()}>
        <ArrowBack/> Match Details
      </IconButton>
      <Grid container spacing={2}>
        <Grid item xl={6}>
            <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'stretch', padding: 2 }}>
              <Grid container spacing={2} justifyContent="space-evenly" alignItems="stretch">
                <Grid item xl={5}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <CardMedia
                      component="img"
                      image={matchDetails.athleteRedImg ? `${img_url}${matchDetails.athleteRedImg}` : "https://via.placeholder.com/150"}
                      alt={matchDetails.athleteRed}
                      sx={{ height: 250, width: 230, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        <Chip label={matchDetails.athleteRed} icon={<SportsGymnasticsRounded  />} sx={{fontSize:"1.25rem"}} color="error" variant="outlined" />
                        
                      </Typography>
                      <Typography variant='h6' component="div" sx={{display:"flex", justifyContent:'center', alignItems:"center"}} color="red">
                      <LocationCity/> {matchDetails.redState}
                      </Typography>
                      <Typography variant='h6' component="div" sx={{display:"flex", justifyContent:'center', alignItems:"center"}} color="red">
                        <Groups3 /> {matchDetails.coachRed}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              <Grid item xl={2} sx={{ display:'flex' , alignItems: 'center'}}>
                  <img src={vs} alt="v/s" style={{width:"5vw", height:"8vh"}} />
              </Grid>
                <Grid item xl={5}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
                    <CardMedia
                      component="img"
                      image={matchDetails.athleteBlueImg ? `${img_url}${matchDetails.athleteBlueImg}` : "https://via.placeholder.com/150"}
                      alt={matchDetails.athleteBlue}
                      sx={{ height: 250, width: 230, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        <Chip label={matchDetails.athleteBlue} icon={<SportsGymnasticsRounded  />} sx={{fontSize:"1.25rem"}} color="primary" variant="outlined" />
                        
                      </Typography>
                      <Typography variant='h6' component="div" sx={{display:"flex", justifyContent:'center', alignItems:"center"}} color="darkblue">
                      <LocationCity/> {matchDetails.bluestate}
                      </Typography>
                      <Typography variant='h6' component="div" sx={{display:"flex", justifyContent:'center', alignItems:"center"}} color="darkblue">
                        <Groups3 /> {matchDetails.coachBlue}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Card>
        </Grid>
            <Grid item xl={6} xs={12} sm={8} md={5}>
                      <TableContainer component={Paper} elevation={3}>
                        <Table>
                          <TableBody>
                            <TableRow >
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo' ,}}><EmojiEventsRounded /> &nbsp; Tournament</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.tournamentId}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}> <Category /> &nbsp; Category</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.categoryId}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}><ModeStandbyRounded /> &nbsp; Match Type</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.matchType}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}><DateRangeRounded /> &nbsp; Match Date</TableCell>
                              <TableCell sx={{ color:'black'}}>{new Date(matchDetails.matchDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}><Groups3 /> &nbsp; Coordinators</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.matchCoordinator}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}><Groups2 /> &nbsp; Referee 1</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.referee1}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}><Groups2 /> &nbsp; Referee 2</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.referee2}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{fontWeight:'bold', display:'flex', alignItems:'center' , color:'indigo'}}><Groups2 /> &nbsp; Referee 3</TableCell>
                              <TableCell sx={{ color:'black'}}>{matchDetails.referee3}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                </Grid>
      </Grid>
    </Box>
  );
};

export default ViewPage;
