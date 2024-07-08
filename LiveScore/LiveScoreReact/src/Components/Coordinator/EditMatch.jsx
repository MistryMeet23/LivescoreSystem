import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography, styled, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { UpMatchValidate } from "../Validation/Coordinator";
import { Close, DateRangeRounded, Person2Rounded, SportsGymnasticsRounded, SportsMartialArtsRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetAthleteByCategoryAndGender, GetMatchById } from "../Apis/Coordinator";
import { useEffect } from "react";
import dayjs from "dayjs";
import { MatchPutApi, clearMessage } from "../../Redux/CoordinatorRedux";
import { toast } from "react-toastify";
import ProtectedRoute from "../../ProtectedRoute";



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const EditMatch = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { mid } = useParams()

    const { data, error } = useSelector(state => state.coordinator)

    const initial = {
        matchStatus :"",
        matchType :"",
        matchDate:"",
        athleteBlue :"",
        athleteRed :"",
    }

    const getMatchById = async() => {
      const { data } = await GetMatchById(mid)
      console.log(data)
        data && setValues(data)
    }

     useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch(clearMessage())
            navigate("/coordinator/match")
        }
        if (error) {
            toast.error(error.msg)
            dispatch(clearMessage())
        }
         }, [data, error, navigate, dispatch])

    useEffect(() => {
        getMatchById()
    }, [])

const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: UpMatchValidate,
        onSubmit: async (values) => {
            dispatch(MatchPutApi({ values, mid }))
            console.log(values)
        }
    })
    const handleClose = () => {
        navigate("/coordinator/match")
    };

  return (
   <div>
            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open="true"
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Edit Match
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
                            <Grid item xl={12} md={6} sm={12} xs={12}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="matchStatus-label">matchStatus</InputLabel>
                                    <Select
                                        labelId="matchStatus-label"
                                        id="matchStatus"
                                        name="matchStatus"
                                        value={values.matchStatus}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                <Person2Rounded />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="Upcoming">Upcoming</MenuItem>
                                        <MenuItem value="Live">Live</MenuItem>
                                        <MenuItem value="Postponed">Postponed</MenuItem>
                                    </Select>
                                    {errors.matchStatus && touched.matchStatus ? (
                                        <Typography variant="subtitle1" color="error">{errors.matchStatus}</Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>
                            <Grid item xl={12} md={6} sm={12} xs={12}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="matchType-label">Match Type</InputLabel>
                                    <Select
                                        labelId="matchType-label"
                                        id="matchType"
                                        name="matchType"
                                        value={values.matchType}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                <Person2Rounded />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="Preliminary">Preliminary</MenuItem>
                                        <MenuItem value="Quarter-Final">Quarter-Final</MenuItem>
                                        <MenuItem value="Semi-Final">Semi-Final</MenuItem>
                                        <MenuItem value="Final">Final</MenuItem>
                                    </Select>
                                    {errors.matchType && touched.matchType ? (
                                        <Typography variant="subtitle1" color="error">{errors.matchType}</Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>
                                <Grid item xl={12} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="matchDate"
                                        name="matchDate"
                                        label="Match Date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                          value={dayjs(values.matchDate).format('YYYY-MM-DD')}
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
                                    {errors.matchDate && touched.matchDate ? (<Typography variant="subtitle1" color="error">{errors.matchDate}</Typography>) : null}
                                </Grid>
                                

                                <Grid item xl={12} md={12} sm={12} xs={12}>

                                    <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>

                </BootstrapDialog>
            </React.Fragment>
        </div>
  )
}

export default ProtectedRoute(EditMatch,"coordinator")