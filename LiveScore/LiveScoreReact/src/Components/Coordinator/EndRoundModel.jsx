import { Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import { GetMatchById, GetTotalScore, ScoreTransfer } from '../Apis/Coordinator';
import { useFormik } from 'formik';
import { endMatch, endRound } from '../Validation/Coordinator';
import { Close, SportsGymnasticsRounded, SportsMartialArtsRounded } from '@mui/icons-material';
import { clearMessage, updateRound } from '../../Redux/CoordinatorRedux';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ProtectedRoute from '../../ProtectedRoute';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EndRoundModel = () => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const {mid, rounds, matchGroup} = useParams()
    const [redPenality, setRedPenality] = useState(0)
    const [bluePenality, setBluePenality] = useState(0)
    const [matchData, setMatchData] = useState(null)
    const [isDisable, setIsDisable] = useState(true)
    const [roundsWinner, setRoundsWinner] = useState([])
    const { data, error } = useSelector(state => state.coordinator)
const athleteBlue = matchData? matchData.athleteBlue :""
const  athleteRed = matchData?matchData.athleteRed :""
const  athleteBlueId =  matchData ? matchData.athleteBlueId:null
const  athleteRedId = matchData ? matchData.athleteRedId :null

    const initial = {
        redTotalScore: "",
        blueTotalScore: "",
        RoundWinner: 0
    }
    const navigate = useNavigate()


     

    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch((clearMessage()))
            if (data.roundswinner) {
                setRoundsWinner(data.roundswinner)
                setIsDisable(false)
            }
        }
        if (error) {
            toast.error(error.msg)
            dispatch((clearMessage()))
        }
    }, [data, error, navigate, dispatch])


    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: endRound,
        onSubmit: async (values) => {
            dispatch(updateRound({ values, mid, rounds }))
            // await ScoreTransfer(mid)
        }

    })

    useEffect(() => {
     const getTotalScore = async () => {
        const data = await GetTotalScore();
        data && setValues(data)
        data && setRedPenality(data.redPanelty)
        data && setBluePenality(data.bluePanelty)
    }

    const getMatchById = async () => {
    const { data } = await GetMatchById(mid)
    data && setMatchData(data)
    console.log(matchData)
    }
        getTotalScore()
        getMatchById()
    }, [mid])
    
    


   
    const handleClose = () => {
         navigate(`/coordinator/scoring/${matchGroup}/${rounds}`)
    };

    const handleNextRound = () => {
        navigate(`/coordinator/AddRound/${mid}/${matchGroup}`)
    }
    const handleNextMatch = () => {
        navigate(`/coordinator/EndMatch/${mid}/${matchGroup}/${rounds}`)
    }






    return (
        <Box>
            <BootstrapDialog
                open={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    End Round
                </DialogTitle>
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
                <DialogContent dividers>

                    {
                        isDisable ? (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xl={6} md={6} sm={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            variant='standard'
                                            id="redPenality"
                                            name="redPenality"
                                            label="Red Total Penality"
                                            value={redPenality}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                        <SportsGymnasticsRounded color="error" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.redTotalScore && touched.redTotalScore ? (<Typography variant="subtitle1" color="error">{errors.redTotalScore}</Typography>) : null}
                                    </Grid>

                                    <Grid item xl={6} md={6} sm={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            variant='standard'
                                            id="bluePenality"
                                            name="bluePenality"
                                            label="Blue Total Penality"
                                            value={bluePenality}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                        <SportsMartialArtsRounded color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.redTotalScore && touched.redTotalScore ? (<Typography variant="subtitle1" color="error">{errors.redTotalScore}</Typography>) : null}
                                    </Grid>
                                    <Grid item xl={6} md={6} sm={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            variant='standard'
                                            id="redTotalScore"
                                            name="redTotalScore"
                                            label="Red Total Score"
                                            value={values.redTotalScore}
                                            // onChange={handleChange}
                                            // onBlur={handleBlur}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                        <SportsGymnasticsRounded color="error" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.redTotalScore && touched.redTotalScore ? (<Typography variant="subtitle1" color="error">{errors.redTotalScore}</Typography>) : null}
                                    </Grid>
                                    <Grid item xl={6} md={6} sm={6} xs={6}>
                                        <TextField
                                            fullWidth
                                            variant='standard'
                                            id="blueTotalScore"
                                            name="blueTotalScore"
                                            label="Red Total Score"
                                            value={values.blueTotalScore}
                                            // onChange={handleChange}
                                            // onBlur={handleBlur}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                        <SportsMartialArtsRounded color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.blueTotalScore && touched.blueTotalScore ? (<Typography variant="subtitle1" color="error">{errors.blueTotalScore}</Typography>) : null}
                                    </Grid>
                                    <Grid item xl={12} md={12} sm={12} xs={12}>
                                        <FormLabel component="legend">Round Winner</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-label="RoundWinner"
                                            id="RoundWinner"
                                            name="RoundWinner"
                                            size='small'
                                            value={values.RoundWinner}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <FormControlLabel value={athleteRedId} control={<Radio />} label={athleteRed} />
                                            <FormControlLabel value={athleteBlueId} control={<Radio />} label={athleteBlue} />
                                        </RadioGroup>
                                        {errors.RoundWinner && touched.RoundWinner ? (<Typography variant="subtitle1" color="error">{errors.RoundWinner}</Typography>) : null}
                                    </Grid>
                                    <Grid item sm={12} xl={8} md={8} lg={8} xs={12}>
                                        <Button variant="contained" color="primary" type='submit'>
                                            End Round
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item sm={12} xl={12} md={12} lg={12} xs={12}>
                                    {roundsWinner?.map((data) => (
                                        <Typography variant="body1" color="initial" key={data.round}>Round {data.round} Winner is {data.roundWinnerName}</Typography>
                                    ))
                                    }
                                </Grid>
                                <Grid item sm={12} xl={6} md={6} lg={6} xs={12}>
                                    <Button variant="contained" color="primary" onClick={handleNextRound} fullWidth>
                                        Next Round
                                    </Button>
                                </Grid>
                                <Grid item sm={12} xl={6} md={6} lg={6} xs={12}>
                                    <Button variant="contained" color="primary" onClick={handleNextMatch} fullWidth>
                                        End Match
                                    </Button>
                                </Grid>
                            </Grid>
                        )
                    }

                </DialogContent>
            </BootstrapDialog>
        </Box>
    )
}

export default ProtectedRoute(EndRoundModel,"coordinator")