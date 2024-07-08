import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearMessage } from "../../Redux/CoordinatorRedux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Paper, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetAssignMatch } from "../Apis/Coordinator";
import MatchCard from "../Common/MatchCard";
import MatchAssign from "./MatchAssign";
import { GetTodayMatch } from "../Apis/Common";
import PieChartComponent from "../Common/PieChartComponent";
import MatchesPerWeekChart from "../Common/MatchesPerWeekChart";
import ProtectedRoute from "../../ProtectedRoute";

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

const CDashboard = () => {
  const dispatch = useDispatch();
  const [todayMatch, setTodayMatch] = useState([]);
  const [assignMatch, setAssignMatch] = useState([]);
  const cid = localStorage.getItem("ID");
  const month = 6
  const year = 2024
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const todayMatchData = await GetTodayMatch();
        // console.log("Fetched today matches:", todayMatchData);
        setTodayMatch(Array.isArray(todayMatchData) ? todayMatchData : []);

        const assignMatchData = await GetAssignMatch(cid);
        setAssignMatch(Array.isArray(assignMatchData) ? assignMatchData : []);
        // console.log("Fetched assign matches:", assignMatch);
      } catch (error) {
        console.error("Something went wrong", error);
        setTodayMatch([]);
        setAssignMatch([]);
      }
    };

    fetchMatches();
  }, [cid]);

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

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h5">Match Assign</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, mt: 1 }}>
            {
              assignMatch && assignMatch.length > 0 ?
                (<Slider {...getSliderSettings(assignMatch.length)}>
                  {assignMatch?.map((data) => (
                    <MatchAssign
                      key={data.mid}
                      matchDate={data.matchDate}
                      athleteRedName={data.athleteRed}
                      athleteBlueName={data.athleteBlue}
                      athleteRedImg={data.athleteRedImg}
                      athleteBlueImg={data.athleteBlueImg}
                      matchGroup={data.matchGroup}
                      mid={data.mid}
                    />
                  ))}
                </Slider>) : (<Typography variant="h4" color="initial" sx={{ textAlign: "center", color: "grey" }}>No Match&apos;s Assigned </Typography>)
            }

          </Box>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ mb: 4, mt: 1 }}>
        <Typography variant="h5" sx={{ color: "Black", mb: 1 }}>Today&apos;s Matches</Typography>
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

      </Box>
      <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }} spacing={2}>
        <Grid item xl={5} md={6} lg={5} sm={12} xs={12} sx={{ height: "100%" }}>
          <Paper elevation={4}>
            <PieChartComponent />
          </Paper>
        </Grid>
        <Grid item xl={7} md={6 } lg={7} sm={12} xs={12} >
          <Paper elevation={4} sx={{ height: "100%" }}>
            <MatchesPerWeekChart month={month} year={year} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProtectedRoute(CDashboard, "coordinator");
