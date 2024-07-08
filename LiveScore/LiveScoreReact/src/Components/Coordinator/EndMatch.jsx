import { Box, Dialog, DialogContent, DialogTitle, FormControlLabel, FormLabel, Grid, IconButton, Radio, RadioGroup, Typography, Button, FormControl, InputLabel, Select, InputAdornment, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { styled,useTheme } from '@mui/material/styles';
import { Close, ModeStandbyRounded } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { GetMatchById } from '../Apis/Coordinator';
import { useFormik } from 'formik';
import { endMatch } from '../Validation/Coordinator';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, updateNextMatchIdApi } from '../../Redux/CoordinatorRedux';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../ProtectedRoute';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
const EndMatch = () => {
    const theme = useTheme()
    const { matchGroup, mid, rounds } = useParams()
    const [matchData, setMatchData] = useState(null)
    const athleteRedId = matchData ? matchData.athleteRedId : null
    const athleteBlueId = matchData ? matchData.athleteBlueId : null
    const dispatch = useDispatch()
    const { data, error } = useSelector(state => state.coordinator)
    const navigate = useNavigate()

    const handleClose = () => {
        navigate(`/coordinator/AddRound/${mid}/${matchGroup}`)
    }


    const initial = {
        mId: mid,
        matchStatus: 'Upcoming',
        matchType: "",
        flag: "",

    }

    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch((clearMessage()))
            navigate("/coordinator/cDashboard")
        }
        if (error) {
            toast.error(error.msg)
            dispatch((clearMessage()))
        }
    }, [data, error, navigate, dispatch])

    useEffect(() => {
        const getMatchById = async () => {
            const { data } = await GetMatchById(mid)
            console.log(data)
            data && setMatchData(data)
        }
        getMatchById()
    }, [])

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initial,
        validationSchema: endMatch,
        onSubmit: (values) => {
            console.log(values)
            const formData = new FormData()
            formData.append("MId", values.mId)
            formData.append("Flag", values.flag)
            dispatch(updateNextMatchIdApi({ mid, values }))
        }


    })





    return (
        <Box>
            <BootstrapDialog
                open={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    End Match
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
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xl={12} md={12} sm={12} xs={12}>
                                <FormLabel component="legend">Select Winner</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="flag"
                                    id="flag"
                                    name="flag"
                                    size='small'
                                    value={values.flag}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <FormControlLabel value={athleteRedId} control={<Radio />} label={matchData ? matchData.athleteRed : ""} />
                                    <FormControlLabel value={athleteBlueId} control={<Radio />} label={matchData ? matchData.athleteBlue : ""} />
                                </RadioGroup>
                                {errors.flag && touched.flag ? (<Typography variant="subtitle1" color="error">{errors.flag}</Typography>) : null}
                            </Grid>
                            <Grid item xl={12} md={12} sm={12} xs={12}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel id="matchType-label">Match Type</InputLabel>
                          <Select
                            id="matchType"
                            name="matchType"
                            label="Match Type"
                            fullWidth
                            variant="standard"
                            value={values.matchType}
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
                          {errors.matchType && touched.matchType ? (<Typography variant="subtitle1" color="error">{errors.matchType}</Typography>) : null}
                        </FormControl>
                      </Grid>
                            <Grid item xl={12} md={12} sm={12} xs={12}>
                                <Button variant="contained" type='submit' color="primary" fullWidth>
                                    End Match
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </BootstrapDialog>
        </Box>
    )
}

export default ProtectedRoute(EndMatch, "coordinator")