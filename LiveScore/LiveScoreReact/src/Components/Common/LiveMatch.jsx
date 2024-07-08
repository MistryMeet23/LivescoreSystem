import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, Grid, Modal, Fade, Backdrop } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GetMatchById } from "../Apis/Coordinator"
import { Close, EmojiEvents, MilitaryTech, SportsGymnasticsRounded, SportsMartialArtsRounded } from "@mui/icons-material";
// import dayjs from "dayjs";
import { styled } from '@mui/material/styles';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const LiveMatch = () => {
  const { mid, matchGroup } = useParams()
  const [matchData, setMatchData] = useState(null)
  const [totalRedPoints, setTotalRedPoints] = useState(0)
  const [totalBluePoints, SetTotalBluePoints] = useState(0)
  const [RedPanelty, setRedPanelty] = useState(0)
  const [BluePanelty, setBluePanelty] = useState(0)
  const [round, setRound] = useState(0)
  const [connection, setConnection] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundWinners, setRoundWinners] = useState([]);

  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const handleClose = () => {
    if (role === "admin") {
      navigate(`/admin/adashboard`)
    }
    if (role === "coordinator") {
      navigate(`/coordinator/cdashboard/`)
    }
  }

  useEffect(() => {
    const getMatchById = async () => {
      const { data } = await GetMatchById(mid)
      // console.log(data)
      data && setMatchData(data)
      console.log(matchData)
    }
    getMatchById()
  }, [mid])

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


    connect.on('ReceiveTotalScore', (data) => {
      setTotalRedPoints(data.totalRedPoints);
      SetTotalBluePoints(data.totalBluePoints);
      setRedPanelty(data.redPanelty);
      setBluePanelty(data.bluePanelty);
    });

    connect.on('TimerUpdate', (timeLeft) => {
      setTimeLeft(timeLeft);
    });
    connect.on('GetRounds', (rounds) => {
      setRound(rounds)
    });

    connect.on('TimerEnded', () => {
      setTimeLeft(0);
    });

    connect.on('ReceiveRoundWinner', (roundWinners) => {
      setRoundWinners(roundWinners);
      setBluePanelty(0)
      setRedPanelty(0)
      setTotalRedPoints(0)
      SetTotalBluePoints(0)
      setRound(0)
      setTimeLeft(0)
    });


    setConnection(connect);

    return () => {
      if (connection) {
        connection.invoke('LeaveGroup', matchGroup.toString())
          .then(() => connection.stop())
          .catch(err => console.error('LeaveGroup invocation failed: ', err));
      }
    };
  }, [matchGroup])

  return (
    <Box>
      <BootstrapDialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        <DialogTitle sx={{ m: 0, p: 2, fontSize: "18px", fontWeight: "bold", fontFamily: "revert", color: "navy", display: "flex" }} id="customized-dialog-title">
          <EmojiEvents />  {matchData ? matchData.tournamentId : ""}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "18px", fontFamily: "TimesNewRoman", color: "#4a148c" }}>{matchData ? matchData.matchType : ""} - {matchData ? matchData.categoryId : ""} </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", color: "#1a237e" }}>Round {round}</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: 'center' }}>
              <Typography variant="h2" color="crimson">{totalRedPoints}</Typography>
              <Typography variant="h5" color="crimson" sx={{ marginTop: "12%" }}>({RedPanelty})</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: 'center' }}>
              <Typography variant="h2" color="crimson">{timeLeft}</Typography>
              <Typography variant="h5" color="crimson" sx={{ marginTop: "18%" }}> S</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: 'center' }}>
              <Typography variant="h2" color="blue">{totalBluePoints}</Typography>
              <Typography variant="h5" color="blue" sx={{ marginTop: "12%" }}>({BluePanelty})</Typography>
            </Grid>
            <Grid item xs={5} sm={5} md={5} lg={5} xl={5} sx={{ textAlign: "center" }}>
              <Typography variant="h5" color="crimson" sx={{ fontWeight: "bold" }}><SportsGymnasticsRounded /> {matchData ? matchData.athleteRed : ""}</Typography>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} sx={{ textAlign: "center" }}></Grid>
            <Grid item xs={5} sm={5} md={5} lg={5} xl={5} sx={{ textAlign: "center" }}>
              <Typography variant="h5" color="blue" sx={{ fontWeight: "bold" }}><SportsMartialArtsRounded /> {matchData ? matchData.athleteBlue : ""}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">Round Winners:</Typography>
              {roundWinners.map((winner, index) => (
                <Typography key={index} variant="body1" color="textSecondary">
                  Round {winner.round}: {winner.roundWinnerName}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
      </BootstrapDialog >
    </Box >
  )
}

export default LiveMatch
