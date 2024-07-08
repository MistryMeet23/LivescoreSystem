import { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Score from './Score'
import MatchCard from './MatchCard'
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowDownward } from '@mui/icons-material'
import { GetAssignMatch, GetTodayMatch } from './Apis'
import AssignMatchCard from './AssignMatchCard'
import { useDispatch } from 'react-redux'
import { clearMessageLogin } from '../Redux/LoginRedux'

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, left: "-15px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const CustomPrevArrowAccordion = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "-20px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const CustomNextArrowAccordion = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "15px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const RDashboard = () => {
  const rid = localStorage.getItem("ID");
  const dispatch = useDispatch()
  const getSliderSettings = (matchesLength) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: matchesLength < 4 ? matchesLength : 4,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
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
          infinite: matchesLength > 1,
          dots: true,
          initialSlide: 1,
          prevArrow: <CustomPrevArrow />,
          nextArrow: <CustomNextArrow />,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: matchesLength < 1 ? matchesLength : 1,
          slidesToScroll: 1,
          infinite: matchesLength > 1,
          dots: true,
          initialSlide: 1,
          prevArrow: <CustomPrevArrow />,
          nextArrow: <CustomNextArrow />,
        },
      },
    ],
  });
  
  const settingsAccordion = (matchesLength) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: matchesLength < 4 ? matchesLength : 4,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrowAccordion />,
    nextArrow: <CustomNextArrowAccordion />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: matchesLength < 4 ? matchesLength : 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          initialSlide: 4,
          prevArrow: <CustomPrevArrowAccordion />,
          nextArrow: <CustomNextArrowAccordion />,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: matchesLength < 2 ? matchesLength : 2,
          slidesToScroll: 1,
          infinite: matchesLength > 1,
          dots: true,
          initialSlide: 1,
          prevArrow: <CustomPrevArrowAccordion />,
          nextArrow: <CustomNextArrowAccordion />,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: matchesLength < 1 ? matchesLength : 1,
          slidesToScroll: 1,
          infinite: matchesLength > 1,
          dots: true,
          initialSlide: 1,
          prevArrow: <CustomPrevArrowAccordion />,
          nextArrow: <CustomNextArrowAccordion />,
        },
      },
    ],
  });
  
  const [todayMatch, setTodayMatch] = useState([]);
  const [assignMatch, setAssignMatch] = useState([]);

  const TodaysMatches = async () => {
    try {
      const data = await GetTodayMatch();
      if (Array.isArray(data)) {
        setTodayMatch(data);
      } else {
        console.error("Expected an array but got", data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const getAssignMatch = async () => {
    try {
      const data = await GetAssignMatch(rid);
      if (Array.isArray(data)) {
        setAssignMatch(data);
        console.log(assignMatch)
      } else {
        console.error("Expected an array but got", data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    dispatch(clearMessageLogin())
    TodaysMatches();
    getAssignMatch();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "block", boxShadow: 3, marginBottom: 3 }}>
        <Header />
      </Box>
      <Box sx={{ display: "block", padding: "0% 0% 0% 2% " }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ pr: "2%" }}>
            <Box sx={{ mb: 1, mt: 1 }}>
              <Accordion sx={{ backgroundColor: "#060c1f", color: "grey" }} elevation={4}>
                <AccordionSummary
                  expandIcon={<ArrowDownward sx={{ color: "whitesmoke" }} />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography variant="h5" sx={{ color: "whitesmoke" }}>Assign Match</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 1, mt: 1, ml: 4 }}>
                    {assignMatch.length === 0 ? (
                      <Typography variant="h5" color="white" textAlign="center">No Match is Assigned</Typography>
                    ) : (
                      <Slider {...settingsAccordion(assignMatch.length)}>
                        {assignMatch.map((match, index) => (
                          <AssignMatchCard
                            key={index}
                            matchDate={match.matchDate}
                            athleteRedImg={match.athleteRedImg}
                            athleteBlueImg={match.athleteBlueImg}
                            athleteRedName={match.athleteRed}
                            athleteBlueName={match.athleteBlue}
                            matchGroup={match.matchGroup}

                          />
                        ))}
                      </Slider>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box sx={{ mb: 4, mt: 1, ml: 2 }}>
              <Typography variant="h5" sx={{ color: "whitesmoke", mb: 1 }}>Today's Matches</Typography>
              <Slider {...getSliderSettings(todayMatch.length)}>
                {todayMatch.map((data, index) => (
                  <MatchCard
                    key={index}
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
            </Box>
          </Grid>

        </Grid>
      </Box>
      <Box sx={{ display: "block", mt: "1%" }}>
        <hr style={{ color: "grey" }} />
        <Footer />
      </Box>
    </Box>
  );
}

export default RDashboard;
