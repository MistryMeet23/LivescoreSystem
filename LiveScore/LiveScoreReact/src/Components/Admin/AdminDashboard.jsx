import ProtectedRoute from '../../ProtectedRoute'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearMessage } from "../../Redux/CoordinatorRedux";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetTodayMatch, GetTotal } from "../Apis/Common";
import MatchCard from '../Common/MatchCard';
import Athletes from '../Images/Icons/Athletes.png'
import Coach from '../Images/Icons/Coach.png'
import Coordinator from '../Images/Icons/coordinator.png'
import Referee from '../Images/Icons/Referees.png'
import { AutoGraphRounded } from '@mui/icons-material';
import PieChartComponent from '../Common/PieChartComponent';
import MatchesPerWeekChart from '../Common/MatchesPerWeekChart';


const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "-25px", color: "black", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "-25px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const getSliderSettings = (matchesLength) => ({
  dots: true,
  infinite: matchesLength > 1,
  speed: 500,
  slidesToShow: matchesLength < 4 ? matchesLength : 4,
  slidesToScroll: 3,
  initialSlide: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: matchesLength < 2 ? matchesLength : 2,
        slidesToScroll: 1,
        infinite: matchesLength > 1,
        dots: true,
        initialSlide: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: matchesLength < 2 ? matchesLength : 2,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
      },
    },
  ],
});

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [todayMatch, setTodayMatch] = useState([]);
  const aid = localStorage.getItem("ID");
  const month = 6
  const year = 2024
  const [totals, setTotals] = useState({
    totalAthletes: 0,
    totalCoaches: 0,
    totalCoordinators: 0,
    totalReferee: 0
  });

  useEffect(() => {
    const fetchTotals = async () => {
      const data = await GetTotal();
      setTotals(data);
      // console.log(totals)
    };

    fetchTotals();
  }, []);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const todayMatchData = await GetTodayMatch();
        // console.log("Fetched today matches:", todayMatchData);
        setTodayMatch(Array.isArray(todayMatchData) ? todayMatchData : []);
      } catch (error) {
        console.error("Something went wrong", error);
        setTodayMatch([]);
      }
    };

    fetchMatches();
  }, [aid]);



  return (
    <div>
      <Typography variant="h5" sx={{ color: "Black", mb: 1 }}>General Statistics  <AutoGraphRounded color='primary' /></Typography>
      <Grid container spacing={2}>
        <Grid item xl={3} md={3} sm={3}>
          <Paper sx={{ height: '15vh', background: 'linear-gradient(90deg, rgba(90,107,234,1) 0%, rgba(0,0,128,1) 100%, rgba(145,58,251,1) 100%)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} elevation={4}>
            <Box component={Paper} elevation={4} sx={{ height: "70%", alignItems: "center", display: "flex", bgcolor: "whitesmoke", borderRadius: "15px", margin: "1% 1% 1% -10%", padding: "5%" }}>
              <img src={Athletes} style={{ height: '100%' }} alt="Athletes" />
            </Box>
            <Box >
              <Typography variant="h3" sx={{ display: 'flex', justifyContent: 'center', color: 'lightgray' }}>{totals.totalAthletes}</Typography>
              <Typography variant="h6" color="lightgoldenrodyellow">Athletes</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xl={3} md={3} sm={3}>
          <Paper sx={{ height: '15vh', background: 'linear-gradient(90deg, rgba(90,107,234,1) 0%, rgba(0,0,128,1) 100%, rgba(145,58,251,1) 100%)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} elevation={4}>
            <Box component={Paper} elevation={4} sx={{ height: "70%", alignItems: "center", display: "flex", bgcolor: "whitesmoke", borderRadius: "15px", margin: "1% 1% 1% -10%", padding: "5%" }}>
              <img src={Coach} style={{ height: '100%' }} alt="Coach" />
            </Box>
            <Box >
              <Typography variant="h3" sx={{ display: 'flex', justifyContent: 'center', color: 'lightgray' }}>{totals.totalCoaches}</Typography>
              <Typography variant="h6" color="lightgoldenrodyellow">Coach</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xl={3} md={3} sm={3}>
          <Paper sx={{ height: '15vh', background: 'linear-gradient(90deg, rgba(90,107,234,1) 0%, rgba(0,0,128,1) 100%, rgba(145,58,251,1) 100%)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} elevation={4}>
            <Box component={Paper} elevation={4} sx={{ height: "70%", alignItems: "center", display: "flex", bgcolor: "whitesmoke", borderRadius: "15px", margin: "1% 1% 1% -5%", padding: "5%" }}>
              <img src={Coordinator} style={{ height: '100%' }} alt="Coordinator" />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ display: 'flex', justifyContent: 'center', color: 'lightgray' }}>{totals.totalCoordinators}</Typography>
              <Typography variant="h6" color="lightgoldenrodyellow">Coordinator</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xl={3} md={3} sm={3}>
          <Paper sx={{ height: '15vh', background: 'linear-gradient(90deg, rgba(90,107,234,1) 0%, rgba(0,0,128,1) 100%, rgba(145,58,251,1) 100%)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} elevation={4}>
            <Box component={Paper} elevation={4} sx={{ height: "70%", alignItems: "center", display: "flex", bgcolor: "whitesmoke", borderRadius: "15px", margin: "1% 1% 1% -10%", padding: "5%" }}>
              <img src={Referee} style={{ height: '100%' }} alt="Referee" />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ display: 'flex', justifyContent: 'center', color: 'lightgray' }}>{totals.totalReferees}</Typography>
              <Typography variant="h6" color="lightgoldenrodyellow">Referee</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mb: 4, mt: 1 }}>
        <Typography variant="h6" sx={{ color: "Black", mb: 1 }}>Today&apos;s Matches</Typography>
        <Box>
          {
            todayMatch && todayMatch.length > 0 ? (
              <Slider {...getSliderSettings(todayMatch.length)}>
                {todayMatch.map((data) => (
                  <MatchCard
                    key={data.mid}
                    matchDate={data.matchDate}
                    athleteRedName={data.athleteRed}
                    athleteBlueName={data.athleteBlue}
                    athleteRedImg={data.athleteRedImg}
                    athleteBlueImg={data.athleteBlueImg}
                    matchGroup={data.matchGroup}
                    mid={data.mid}
                    matchStatus={data.matchStatus}
                  />
                ))}
              </Slider>
            ) : (
              <Box sx={{ width: "100%", height: "20vh" }}>
                <Typography variant="h4" color="initial" sx={{ textAlign: "center", color: "grey" }}>No Match&apos;s Today </Typography>
              </Box>
            )
          }
        </Box>

        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', marginTop:"2%" }}  spacing={2}>
          <Grid item xl={5} md={5} lg={5} sm={12} sx={{ height: "100%" }}>
            <Paper elevation={4}>
              <PieChartComponent />
            </Paper>
          </Grid>
          <Grid item xl={7} md={7} lg={7} sm={12} >
            <Paper elevation={4} sx={{ height: "100%" }}>
              <MatchesPerWeekChart month={month} year={year} />
            </Paper>
          </Grid>
        </Grid>
      </Box>

    </div>
  );
};

export default ProtectedRoute(AdminDashboard, 'admin')
