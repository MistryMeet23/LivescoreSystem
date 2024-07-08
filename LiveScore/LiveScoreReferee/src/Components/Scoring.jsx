import { Box, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { GetMatchByMatchGroup } from './Apis';
import globalRoute from './GlobalRoute';



const Scoring = () => {
  const [penalityRed, setPenalityRed] = useState(0);
  const [penalityBlue, setPenalityBlue] = useState(0);
  const [scoreRed, setScoreRed] = useState(0);
  const [scoreBlue, setScoreBlue] = useState(0);
  const [connection, setConnection] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { matchGroup } = useParams();
  const rid = localStorage.getItem("ID");
  const [matchData, setMatchData] = useState(null);
  const [isDisable, setIsDisable] = useState(false)

  const [values, setValues] = useState({
    RedPoints: 0,
    BluePoints: 0,
    RedPenalty: 0,
    BluePenalty: 0,
  })


  useEffect(() => {
    console.log(values);
    globalRoute.post(`/RefereeScore/CreateRefScore/${rid}/${matchGroup}`, values, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch(err => console.error('Sending score is failed : ', err));

  }, [values, globalRoute]);

  useEffect(() => {
    const fetchMatchData = async () => {
      const { data } = await GetMatchByMatchGroup(matchGroup);
      setMatchData(data);
      console.log(matchData)
    };
    fetchMatchData();

  }, [matchGroup]);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('/scoreHub')  // Use relative URL
      .configureLogging(LogLevel.Information)
      .build();

    connect.start()
      .then(() => {
        console.log('Connected to SignalR');
        return connect.invoke('JoinGroup', matchGroup.toString());
      })
      .then(() => {
        console.log(`Joined Matchgroup ${matchGroup}`);
      })
      .catch(err => console.error('JoinGroup invocation failed: ', err));

    connect.on('TimerUpdate', (timeLeft) => {
      console.log('TimerUpdate received: ', timeLeft);
      setTimeLeft(timeLeft);
      setIsDisable(true);
    });

    connect.on('TimerEnded', () => {
      console.log('TimerEnded received');
      setTimeLeft(0);
      setIsDisable(false);
    });

    connect.on('PauseCountdown', () => {
      console.log('PauseCountdown received');
      setIsDisable(false);
    });

    connect.on('ResumeCountdown', () => {
      console.log('ResumeCountdown received');
      setIsDisable(true);
    });

    setConnection(connect);

    return () => {
      if (connection) {
        connection.invoke('LeaveGroup', matchGroup.toString())
          .then(() => connection.stop())
          .catch(err => console.error('LeaveGroup invocation failed: ', err));
      }
    };
  }, [matchGroup]);


  const handleRedScore = (increment) => {
    setScoreRed((prevValue) => prevValue + increment);
    setValues({ RedPoints: increment, BluePoints: 0, RedPenalty: 0, BluePenalty: 0 });
  };

  const handleBlueScore = (increment) => {
    setScoreBlue((prevValue) => prevValue + increment);
    setValues({ BluePoints: increment, RedPoints: 0, BluePenalty: 0, RedPenalty: 0 });
  };

  const handleRedPenality = () => {
    if (penalityRed < 5) {
      setPenalityRed(prev => {
        const newCount = prev + 1;
        setValues({ RedPenalty: 1, BluePoints: 0, RedPoints: 0, BluePenalty: 0 });
        setScoreBlue((prevValue) => prevValue + 1);
        if (newCount === 5) {
          alert('Athlete Red Disqualified!');
        }
        return newCount;
      });
    }
  };

  const handleBluePenality = () => {
    if (penalityBlue < 5) {
      setPenalityBlue(prev => {
        const newCount = prev + 1;
        setValues({ BluePenalty: 1, RedPenalty: 0, BluePoints: 0, RedPoints: 0 })
        setScoreRed((prevValue) => prevValue + 1);
        if (newCount === 5) {
          alert('Athlete Blue Disqualified!');
        }
        return newCount;
      });
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ color: "white" }}>
        <Grid item xs={12} md={6} lg={6} sm={6}>
          <Typography variant="subtitle1" style={{ textAlign: "center", fontWeight: "bold", fontSize: "5vh", fontFamily: "TimesNewRoman", color: "#bdbdbd", marginBottom: "4%", marginTop: "2%" }}>{matchData ? matchData.tournamentId : ""}</Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sm={6}>
          <Typography variant="subtitle1" sx={{ textAlign: "center", fontWeight: "bold", fontSize: "5vh", fontFamily: "TimesNewRoman", color: "#bdbdbd", marginBottom: "4%", marginTop: "2%" }}>{matchData ? matchData.matchType : ""} - {matchData ? matchData.categoryId : ""} </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12} sm={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={4} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }} fullWidth >

                <Box
                  component="img"
                  src={matchData ? `/images/${matchData.athleteRedImg}` : "https://via.placeholder.com/150"}
                  sx={{
                    height: { lg: '15vh', md: '20vh', xl: "15vh", sm: "10vh", xs: '10vh' },
                    width: { lg: '7vw', md: "10vw", sm: "7vw", xs: "7vw", xl: '7vw' },
                    borderRadius: '10px',
                  }}
                  alt="Athlete"
                />
                <Typography variant="h1" style={{ color: "#e53935", fontSize: "20vh" }}>{scoreRed}</Typography>
              </Box>

            </Grid>
            <Grid item xs={12} md={4} lg={4} sm={4}>
              <Box sx={{
                backgroundColor: "#141c33",
                height: "100%", // Changed to 100vh to fill the viewport height
                borderRadius: "15px",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Typography variant="h1" sx={{ color: "#bdbdbd", textAlign: 'center', fontSize: "20vh" }}>
                  {timeLeft}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} lg={4} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }} fullWidth >

                <Typography variant="h1" sx={{ color: "#1e88e5", textAlign: "center", fontSize: "20vh" }}>{scoreBlue}</Typography>
                <Box
                  component="img"
                  src={matchData ? `/images/${matchData.athleteBlueImg}` : "https://via.placeholder.com/150"}
                  sx={{
                    height: { lg: '15vh', md: '20vh', xl: "15vh", sm: "10vh", xs: '10vh' },
                    width: { lg: '7vw', md: "10vw", sm: "7vw", xs: "7vw", xl: '7vw' },
                    borderRadius: '10px',
                  }}
                  alt="Athlete"
                />
              </Box>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} md={4} lg={4} sm={4}>
          <Typography variant="h4" style={{ color: "#e53935", fontSize: "5vh", textAlign: "center" }}>{matchData ? matchData.athleteRed : ""}</Typography>
        </Grid>
        <Grid item xs={4} md={4} lg={4} sm={4}>
        </Grid>
        <Grid item xs={4} md={4} lg={4} sm={4}>
          <Typography variant="h4" style={{ color: "#1e88e5", fontSize: "5vh", textAlign: "center" }}>{matchData ? matchData.athleteBlue : ""}</Typography>
        </Grid>
        {isDisable ?
          (
            <>
              <Grid item xs={12} md={4} lg={4} sm={4}>
                <Grid container spacing={2} sx={{ ml: "1%", mt: { lg: "-1%", xl: "-4%", md: "-10%", sm: "-10%", xs: "-10%" } }}>
                  <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={() => handleRedScore(2)} fullWidth>
                      +2
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={() => handleRedScore(1)} fullWidth>
                      +1
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={() => handleRedScore(3)} fullWidth>
                      +3
                    </Button>
                  </Grid>
                  {/* <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: { lg: "4vh", xl: "5vh", md: "5vh", sm: "4vh", xs: "2vh" }, fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={handleRedPenality} disabled={penalityRed === 5} fullWidth>
                      penality
                    </Button>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={4} sm={4}>
                {/* <Grid container spacing={2} sx={{ mt: { lg: "1%", xl: "-4%", md: "-10%", sm: "-10%", xs: "-10%" } }} >
                  <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: { lg: 'row', xl: 'row', md: "column", sm: "column", xs: "column" }, alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ display: 'flex', flexDirection: { lg: "column", md: "column", xl: 'column', sm: "column", xs: "row" }, gap: 2 }}>
                        {[...Array(5)].map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: { xl: 50, lg: 60, md: 25, sm: 25, xs: 50 },
                              height: { xl: 50, lg: 60, md: 25, sm: 20, xs: 50 },
                              borderRadius: '50%',
                              backgroundColor: index < penalityRed ? '#e53935' : '#141c33',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: { lg: 'row', xl: 'row', md: "column", sm: "column", xs: "column" }, alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ display: 'flex', flexDirection: { lg: "column", md: "column", xl: 'column', sm: "column", xs: "row" }, gap: 2 }}>
                        {[...Array(5)].map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: { xl: 50, lg: 60, md: 25, sm: 25, xs: 50 },
                              height: { xl: 50, lg: 60, md: 25, sm: 20, xs: 50 },
                              borderRadius: '50%',
                              backgroundColor: index < penalityBlue ? '#1e88e5' : '#141c33',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid> */}
              </Grid>
              <Grid item xs={12} md={4} lg={4} sm={4}>
                <Grid container spacing={2} sx={{ ml: "-10%", mt: { lg: "-1%", xl: "-4%", md: "-10%", sm: "-10%", xs: "-10%" } }}>
                  <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={() => handleBlueScore(1)} fullWidth>
                      +1
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={() => handleBlueScore(2)} fullWidth>
                      +2
                    </Button>
                  </Grid>


                  {/* <Grid item xs={6} md={6} lg={6} sm={6}>
                    <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: { lg: "4vh", xl: "5vh", md: "5vh", sm: "4vh", xs: "2vh" }, fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={handleBluePenality} disabled={penalityBlue === 5} fullWidth>
                      penality
                    </Button>
                  </Grid> */}
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "20vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={() => handleBlueScore(3)} fullWidth>
                      +3
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>) : ""
        }
      </Grid>
    </Box>
  );
};

export default Scoring;
