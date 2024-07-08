import { AccessTimeFilledRounded, Category, Close, DateRangeRounded, DonutLargeRounded, EmojiEventsRounded, ModeStandbyRounded, RestartAltRounded, SportsGymnasticsRounded, SportsMartialArtsRounded, } from "@mui/icons-material";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MatchValidate } from "../Validation/Coordinator";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useState } from "react";
import { GetCategory, GetTournament } from "../Apis/Admin";
import { GetAthleteByCategoryAndGender } from "../Apis/Coordinator";
import { AddMatchApi, clearMessage } from "../../Redux/CoordinatorRedux";
import ProtectedRoute from "../../ProtectedRoute";



const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <DonutLargeRounded />,
    2: <GroupAddIcon />,
    3: <AccessTimeFilledRounded />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['Select Data', 'Select Athlete', 'Scheduling'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {lg:'50%',md:"50%",sm:"60%",xs:"80%"},
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 14,
  p: 4,
};


const AddMatch = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [category, setCategory] = useState()
  const [tournament, setTournament] = useState()
  const [athlete, setAthlete] = useState()

  useEffect(() => {
    getCategory()
    getTournament()
  }, [])

  const getCategory = async () => {
    const { data } = await GetCategory()
    data && setCategory(data)
  }

  const getTournament = async () => {
    const { data } = await GetTournament()
    data && setTournament(data)
  }


  const getAthleteByCatAndGender = async (id, gender) => {
    const { data } = await GetAthleteByCategoryAndGender(id, gender)
    data && setAthlete(data)
  }

  // const { active, completed, className } = props;

  //   for dialog box start
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log('last step');
      alert('Form submitted successfully!');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  const ToSelectAthlete = (id, gender) => {
    getAthleteByCatAndGender(id, gender)
    setActiveStep((prevStep) => prevStep + 1);
  }


  const initial = {
    MatchType: "",
    MatchDate: "",
    AthleteBlue: "",
    AthleteRed: "",
    CategoryId: "",
    TournamentId: "",
    Gender: ""
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initial,
    validationSchema: MatchValidate,
    onSubmit: (values) => {
      dispatch(AddMatchApi(values))
      dispatch(clearMessage())
      handleClose();
    }
  })


  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Match
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Match
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} sm={12} xl={12}>
                {activeStep === 0 && (
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12} xl={12}>
                      <FormControl variant='filled' fullWidth>
                        <InputLabel color='secondary'>Tournament</InputLabel>
                        <Select
                          id="TournamentId"
                          name="TournamentId"
                          label="Tournament"
                          fullWidth
                          color="secondary"
                          value={values.TournamentId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          input={<OutlinedInput
                            startAdornment={<InputAdornment position="start">
                              <EmojiEventsRounded />
                            </InputAdornment>}
                          />}
                        >
                          {tournament?.map((data) => (
                            <MenuItem key={data.tId} value={data.tId}>{data.tournamentName}</MenuItem>
                          ))
                          }
                        </Select>
                      </FormControl>
                      {errors.TournamentId && touched.TournamentId ? (<Typography variant="subtitle1" color="error">{errors.TournamentId}</Typography>) : null}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <FormControl variant='filled' fullWidth>
                        <InputLabel color='secondary'>Category</InputLabel>
                        <Select
                          id="CategoryId"
                          name="CategoryId"
                          label="Category"
                          color="secondary"
                          variant="filled"
                          value={values.CategoryId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          input={<OutlinedInput
                            startAdornment={<InputAdornment position="start">
                              <Category />
                            </InputAdornment>}
                          />}
                        >
                          {category?.map((data) => (
                            <MenuItem key={data.id} value={data.id} >{data.categoryName}</MenuItem>
                          ))
                          }
                        </Select>
                      </FormControl>
                      {errors.CategoryId && touched.CategoryId ? (<Typography variant="subtitle1" color="error">{errors.CategoryId}</Typography>) : null}

                    </Grid>
                    <Grid item xl={12} md={12} sm={12} xs={12}>
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup
                        row
                        aria-label="Gender"
                        id="Gender"
                        name="Gender"
                        size='small'
                        value={values.Gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                      </RadioGroup>
                      {errors.Gender && touched.Gender ? (<Typography variant="subtitle1" color="error">{errors.Gender}</Typography>) : null}
                      <Grid item sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                          Back
                        </Button>
                        <Button onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          ToSelectAthlete(values.CategoryId, values.Gender)
                        }}>Next</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {activeStep === 1 && (
                  <Grid item xs={12} md={12} lg={12} sm={12} >
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FormControl variant='filled' fullWidth>
                          <InputLabel color='secondary'>Athlete Red</InputLabel>
                          <Select
                            id="AthleteRed"
                            name="AthleteRed"
                            label="Athlete Red"
                            fullWidth
                            variant="standard"
                            value={values.AthleteRed}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            input={<OutlinedInput
                              startAdornment={<InputAdornment position="start">
                                <SportsGymnasticsRounded color="error" />
                              </InputAdornment>}
                            />}
                          >
                            {athlete && athlete.length > 0 ? (
                              athlete.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                  {data.athleteName}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No athletes added</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                        {errors.AthleteRed && touched.AthleteRed ? (<Typography variant="subtitle1" color="error">{errors.AthleteRed}</Typography>) : null}
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FormControl variant='filled' fullWidth>
                          <InputLabel color='secondary'>Athlete Blue</InputLabel>
                          <Select
                            variant="standard"
                            id="AthleteBlue"
                            name="AthleteBlue"
                            label="Athlete Blue"
                            fullWidth
                            value={values.AthleteBlue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            input={<OutlinedInput
                              startAdornment={<InputAdornment position="start">
                                <SportsMartialArtsRounded color="primary" />
                              </InputAdornment>}
                            />}
                          >
                            {athlete && athlete.length > 0 ? (
                              athlete.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                  {data.athleteName}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No athletes added</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                        {errors.AthleteBlue && touched.AthleteBlue ? (<Typography variant="subtitle1" color="error">{errors.AthleteBlue}</Typography>) : null}
                        <Grid item sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                          <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                          </Button>
                          {activeStep === steps.length - 1 ? (
                            <Button onClick={handleSubmit}>Submit</Button>
                          ) : (
                            <Button onClick={handleNext}>Next</Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {activeStep === 2 && (
                  <Grid item xs={12} md={12} lg={12} sm={12} >
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          id="MatchDate"
                          name="MatchDate"
                          label="Match Date"
                          fullWidth
                          type="date"
                          variant="standard"
                          value={values.MatchDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >
                                <DateRangeRounded />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {errors.MatchDate && touched.MatchDate ? (<Typography variant="subtitle1" color="error">{errors.MatchDate}</Typography>) : null}
                      </Grid>

                      <Grid item xl={12} md={12} sm={12} xs={12}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel id="matchType-label">Match Type</InputLabel>
                          <Select
                            id="MatchType"
                            name="MatchType"
                            label="Match Type"
                            fullWidth
                            variant="standard"
                            value={values.MatchType}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            startAdornment={
                              <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                <ModeStandbyRounded />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="Preliminary">Preliminary</MenuItem>
                            <MenuItem value="Quarter-Final">Quarter-Final</MenuItem>
                            <MenuItem value="Semi-Final">Semi-Final</MenuItem>
                            <MenuItem value="Final">Final</MenuItem>
                          </Select>
                          {errors.MatchType && touched.MatchType ? (<Typography variant="subtitle1" color="error">{errors.MatchType}</Typography>) : null}
                        </FormControl>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>

                        <Grid item sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                          <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                          </Button>
                          {activeStep === steps.length - 1 ? (
                            <Button onClick={handleSubmit}>Submit</Button>
                          ) : (
                            <Button onClick={handleNext}>Next</Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default ProtectedRoute(AddMatch, "coordinator")
