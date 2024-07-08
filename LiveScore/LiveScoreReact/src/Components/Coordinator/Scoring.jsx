import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Tooltip } from '@mui/material';
import { PauseCircleFilledRounded, PlayCircleFilledRounded } from '@mui/icons-material';
import { GetMatchByMatchGroup, ScoreTransfer } from '../Apis/Coordinator';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../ProtectedRoute';
import ReviewMatch from './ReviewMatch';
import globalRoute from '../../Redux/GlobalRoute';

const Scoring = () => {
    const [connection, setConnection] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const { matchGroup, rounds } = useParams();
    const cid = localStorage.getItem("ID");
    const [penalityRed, setPenalityRed] = useState(0)
    const [penalityBlue, setPenalityBlue] = useState(0)
    const [scoreRed, setScoreRed] = useState(0)
    const [scoreBlue, setScoreBlue] = useState(0)
    const [matchData, setMatchData] = useState(null);
    const [isDisable, setIsDisable] = useState(false)
    const [isReview, setIsReview] = useState(false)
    const athleteRed = matchData ? matchData.athleteRedId : "";
    const athleteBlue = matchData ? matchData.athleteBlueId : "";
    const   mid = matchData ? matchData.mid : "";
    const navigate = useNavigate()
    const [refScore, setRefScore] = useState({
        RefereeId: "",
        RedPoints: 0,
        BluePoints: 0,
        RedPanelty: 0,
        BluePanelty: 0
    })

    const [values, setValues] = useState({
        RedPoints: 0,
        BluePoints: 0,
        RedPanelty: 0,
        BluePanelty: 0
    })

    const handleEndRound = async () => {
        await ScoreTransfer(mid)
        navigate(`/coordinator/EndRoundModel/${mid}/${matchGroup}/${rounds}`)
    }


    useEffect(() => {
        const fetchMatchData = async () => {
            const { data } = await GetMatchByMatchGroup(matchGroup);
            setMatchData(data);
        };
        fetchMatchData();

    }, [matchGroup]);

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl('/scoreHub')
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

        connect.on('StartCountdown', (duration) => {
            console.log('StartCountdown received', duration);
            setIsRunning(true);
            setTimeLeft(duration);
        });

        connect.on('StopCountdown', () => {
            console.log('StopCountdown received');
            setIsRunning(false);
        });

        connect.on('TimerUpdate', (timeLeft) => {
            console.log('TimerUpdate received', timeLeft);
            setTimeLeft(timeLeft);
        });

        connect.on('TimerEnded', () => {
            console.log('TimerEnded received');
            setIsRunning(false);
            setTimeLeft(0);
        });

        connect.on('PauseCountdown', () => {
            console.log('PauseCountdown received');
            setIsRunning(false);
        });

        connect.on('ResumeCountdown', () => {
            console.log('ResumeCountdown received');
            setIsRunning(true);
        });

        connect.on('ReceiveLastRefScore', (refScoreA) => {
            if (refScoreA) {
                setRefScore({
                    RefereeId: refScoreA ? refScoreA.refereeId : null,
                    RedPoints: refScoreA ? refScoreA.redPoints : 0,
                    BluePoints: refScoreA ? refScoreA.bluePoints : 0,
                    RedPanelty: refScoreA ? refScoreA.redPenalty : 0,
                    BluePanelty: refScoreA ? refScoreA.bluePenalty : 0,
                });
            }
        });

        connect.on('ReceiveTotalScore', (data) => {
            setScoreRed(data.totalRedPoints);
            setScoreBlue(data.totalBluePoints);
            setPenalityRed(data.redPanelty);
            setPenalityBlue(data.bluePanelty);
          });
        setConnection(connect)

        return () => {
            if (connection) {
                connection.invoke('LeaveGroup', matchGroup.toString())
                    .then(() => connection.stop())
                    .catch(err => console.error('Failed to leave group or stop connection: ', err));
            }
        };
    }, [matchGroup]);

    useEffect(() => {
        if (timeLeft == 0) {
            setIsDisable(true)
        }
        console.log(values);
        globalRoute.post(`/Scores/insert/${rounds}/${athleteRed}/${athleteBlue}/${mid}`, values, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(err => console.error('Sending score is failed : ', err));

    }, [values, globalRoute]);

    const handleStart = () => {
        if (connection) {
            globalRoute.post(`/Scores/start/${parseInt(matchGroup)}/${cid}/${120}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .catch(err => console.error('StartCountdown request failed: ', err));
            setIsDisable(false)
            setIsReview(false)
        }
    };


    const handlePause = () => {
        if (connection) {
            globalRoute.post(`/Scores/pause/${parseInt(matchGroup)}/${cid}`, {}, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .catch(err => console.error('PauseCountdown request failed: ', err));
            setIsDisable(true)
            setIsReview(true)
        }
    };

    const handleResume = () => {
        if (connection) {
            globalRoute.post(`/Scores/resume/${parseInt(matchGroup)}/${cid}`, {}, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .catch(err => console.error('ResumeCountdown request failed: ', err));
            setIsDisable(false)
            setIsReview(false)
        }
    };

    const handleRedScore = (increment) => {
        // setScoreRed((prevValue) => prevValue + increment);
        setValues({ RedPoints: increment, BluePanelty: 0, BluePoints: 0, RedPanelty: 0 });
    };



    const handleBlueScore = (increment) => {
        // setScoreBlue((prevValue) => prevValue + increment);
        setValues({ BluePoints: increment, RedPoints: 0, RedPanelty: 0, BluePanelty: 0 });

    };

    const handleRedPenality = () => {
        if (penalityRed < 5) {
            setPenalityRed(prev => {
                const newCount = prev + 1;
                setValues({ RedPanelty: 1, BluePanelty: 0, RedPoints: 0, BluePoints: 0 });
                // setScoreBlue((prevValue) => prevValue + 1);
                if (newCount === 5) {
                    toast.error("Athlete Red Disqualified!")
                    setIsDisable(true)
                }
                return newCount;
            });
        }
    };

    const handleBluePenality = () => {
        if (penalityBlue < 5) {
            setPenalityBlue(prev => {
                const newCount = prev + 1;
                setValues({ BluePanelty: 1, RedPanelty: 0, BluePoints: 0, RedPoints: 0 })
                // setScoreRed((prevValue) => prevValue + 1);
                if (newCount === 5) {
                    toast.error("Athlete Blue Disqualified!")
                    setIsDisable(true)
                }
                return newCount;
            });
        }
    };

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center">
                <Grid item sm={12} xl={4} md={4} lg={4} xs={12}>
                    <Paper elevation={4} sx={{ margin: '0.5%', height: "100%" }}>
                        <Typography variant="h2" color="initial" sx={{ textAlign: "center", paddingTop: "5%" }}>{timeLeft} s</Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', margin: "1% 1% 1% -2%" }}>
                            <Tooltip title="Start">
                                <IconButton variant='contained' color='success' onClick={handleStart} disabled={isRunning}  ><PlayCircleFilledRounded sx={{ height: "8vh", width: "8vw" }} /></IconButton>
                            </Tooltip>
                            <Tooltip title="Pause">
                                <IconButton variant='contained' color='error' onClick={handlePause} disabled={!isRunning}><PauseCircleFilledRounded sx={{ height: "8vh", width: "8vw" }} /></IconButton>
                            </Tooltip>
                            <Tooltip title="Resume">
                                <IconButton variant='contained' color='warning' onClick={handleResume} disabled={isRunning || timeLeft === 0}><PlayCircleFilledRounded sx={{ height: "8vh", width: "8vw" }} /></IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item sm={12} xl={8} md={8} lg={8} xs={12}>
                    <Paper elevation={4} sx={{ margin: '0.5%', padding: "2%", height: "100%" }}>
                        <TableContainer sx={{ width: "100%", padding: "1% 1% 0% 0%" }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>Referees</TableCell>
                                        <TableCell align="center">Red Score</TableCell>
                                        <TableCell align="center">Blue Score</TableCell>
                                        <TableCell align="center">Red Penalty</TableCell>
                                        <TableCell align="center">Blue Penalty</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align='center'>referee1</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: "bold" }}>{refScore.RedPoints}</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: "bold" }}>{refScore.BluePoints}</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: "bold" }}>{refScore.RedPanelty}</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: "bold" }}>{refScore.BluePanelty}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item sm={4} xl={4} md={4} lg={4} sx={4}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }} fullWidth >

                        <img src={matchData ? `/images/${matchData.athleteRedImg}` : "https://via.placeholder.com/150"} style={{ height: "13vh", width: "7vw", borderRadius: "10px" }} />
                        <Typography variant="h1" style={{ color: "#e53935", fontSize: "15vh" }}>{scoreRed}</Typography>
                    </Box>
                    <Typography variant="h4" style={{ color: "#e53935", fontSize: "5vh", textAlign: "center" }}>{matchData ? matchData.athleteRed : ""}</Typography>
                </Grid>
                <Grid item sm={4} xl={4} md={4} lg={4} sx={4}></Grid>
                <Grid item sm={4} xl={4} md={4} lg={4} sx={4}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }} fullWidth >

                        <Typography variant="h1" sx={{ color: "#1e88e5", textAlign: "center", fontSize: "15vh" }}>{scoreBlue}</Typography>
                        <img src={matchData ? `/images/${matchData.athleteBlueImg}` : "https://via.placeholder.com/150"} style={{ height: "13vh", width: "7vw", borderRadius: "10px" }} />
                    </Box>
                    <Typography variant="h4" style={{ color: "#1e88e5", fontSize: "5vh", textAlign: "center" }}>{matchData ? matchData.athleteBlue : ""}</Typography>
                </Grid>
                {isDisable ? <></> : <>
                    <Grid item xs={12} md={4} lg={4} sm={4}>
                        <Grid container spacing={2} sx={{ ml: "1%", mt: { lg: "-1%", xl: "-4%", md: "-10%", sm: "-10%", xs: "-10%" } }}>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={() => handleRedScore(2)} fullWidth>
                                    +2
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={() => handleRedScore(1)} fullWidth>
                                    +1
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={() => handleRedScore(3)} fullWidth>
                                    +3
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#e53935", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: { lg: "3vh", xl: "4vh", md: "4vh", sm: "3vh", xs: "1.5vh" }, fontWeight: "bold", '&:hover': { backgroundColor: "#e53935" } }} onClick={handleRedPenality} disabled={penalityRed === 5} fullWidth>
                                    penality
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} sm={4}>
                        <Grid container spacing={2} sx={{ mt: { lg: "1%", xl: "-4%", md: "-10%", sm: "-10%", xs: "-10%" } }} >
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Box sx={{ display: 'flex', flexDirection: { lg: 'row', xl: 'row', md: "column", sm: "column", xs: "column" }, alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ display: 'flex', flexDirection: { lg: "column", md: "column", xl: 'column', sm: "column", xs: "row" }, gap: 2 }}>
                                        {[...Array(5)].map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: { xl: 30, lg: 40, md: 20, sm: 20, xs: 40 },
                                                    height: { xl: 30, lg: 40, md: 20, sm: 18, xs: 40 },
                                                    borderRadius: '50%',
                                                    backgroundColor: index < penalityRed ? '#e53935' : 'grey',
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
                                                    width: { xl: 30, lg: 40, md: 20, sm: 20, xs: 40 },
                                                    height: { xl: 30, lg: 40, md: 20, sm: 18, xs: 40 },
                                                    borderRadius: '50%',
                                                    backgroundColor: index < penalityBlue ? '#1e88e5' : 'grey',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} sm={4}>
                        <Grid container spacing={2} sx={{ ml: "-10%", mt: { lg: "-1%", xl: "-4%", md: "-10%", sm: "-10%", xs: "-10%" } }}>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={() => handleBlueScore(1)} fullWidth>
                                    +1
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={() => handleBlueScore(2)} fullWidth>
                                    +2
                                </Button>
                            </Grid>


                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize:  { lg: "3vh", xl: "4vh", md: "4vh", sm: "3vh", xs: "1.5vh" }, fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={handleBluePenality} disabled={penalityBlue === 5} fullWidth>
                                    penality
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} sm={6}>
                                <Button variant="contained" sx={{ backgroundColor: "#1e88e5", height: "13vh", borderRadius: { lg: "30px", xl: "30px", md: "15px", sm: "15px", xs: "30px" }, fontSize: "10vh", fontWeight: "bold", '&:hover': { backgroundColor: "#1e88e5" } }} onClick={() => handleBlueScore(3)} fullWidth>
                                    +3
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
                }
                <Grid item sm={12} xl={8} md={8} lg={8} xs={12} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant="contained" color="primary" onClick={handleEndRound} >
                        End Round
                    </Button>
                    {
                        isReview ? <ReviewMatch mid={mid} /> : " "
                    }
                </Grid>
            </Grid>
        </Box>
    );

}

export default ProtectedRoute(Scoring, "coordinator");
