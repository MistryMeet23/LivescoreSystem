import { AddLocationAltRounded, AlternateEmailRounded, CategoryRounded, Close, DateRangeRounded, Height, LocationCityRounded, MonitorWeight, PermContactCalendarRounded, Person2Rounded } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { GetAthleteById, GetCoach } from '../Apis/Coordinator';
import { upAthlete } from '../Validation/Coordinator';
import { AthletePutApi, clearMessage } from '../../Redux/CoordinatorRedux';
import ProtectedRoute from '../../ProtectedRoute';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditAthelete = () => {
    const [category, setCategory] = useState()
    const { data, error } = useSelector(state => state.coordinator)
    const theme = useTheme()
    const [coach, setCoach] = useState()
    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const initial = {
        athleteName: "",
        email: "",
        contact: "",
        gender: "",
        height: "",
        weight: "",
        dateOfBirth: "",
        city: "",
        state: "",
        coachName: "",
    }

    const getAthleteById = async () => {
        const { data } = await GetAthleteById(id)
        data && setValues(data)
        data && setCategory(data.categoryName)
    }

    const getCoach = async () => {
        const { data } = await GetCoach()
        data && setCoach(data)
    }


    useEffect(() => {
        getAthleteById()
        getCoach()
    }, [])


    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: upAthlete,
        onSubmit: async (values) => {
            dispatch(AthletePutApi({ values, id }))
        }
    })

    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch(clearMessage())
            navigate("/coordinator/athlete")
        }
        if (error) {
            toast.error(error.msg)
            dispatch(clearMessage())
        }
    }, [data, error, navigate, dispatch])


    const handleClose = () => {
        navigate("/coordinator/athlete")
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
                        Edit Athlete
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
                            <Grid container spacing={1}>
                                <Grid item xl={12} md={12} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="athleteName"
                                        name="athleteName"
                                        label="Name"
                                        value={values.athleteName}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <Person2Rounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.athleteName && touched.athleteName ? (<Typography variant="subtitle1" color="error">{errors.athleteName}</Typography>) : null}
                                </Grid>

                                <Grid item xl={12} md={12} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="email"
                                        name="email"
                                        label="Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                    <AlternateEmailRounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.email && touched.email ? (<Typography variant="subtitle1" color="error">{errors.email}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="contact"
                                        name="contact"
                                        label="Contact"
                                        type="number"
                                        value={values.contact}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <PermContactCalendarRounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.contact && touched.contact ? (<Typography variant="subtitle1" color="error">{errors.contact}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={dayjs(values.dateOfBirth).format('YYYY-MM-DD')}
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
                                    {errors.dateOfBirth && touched.dateOfBirth ? (<Typography variant="subtitle1" color="error">{errors.dateOfBirth}</Typography>) : null}
                                </Grid>

                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="gender"
                                        id="gender"
                                        name="gender"
                                        size='small'
                                        value={values.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <FormControlLabel value="Male" control={<Radio size='small' />} label="Male" />
                                        <FormControlLabel value="Female" control={<Radio size='small' />} label="Female" />
                                        <FormControlLabel value="Other" control={<Radio size='small' />} label="Other" />
                                    </RadioGroup>
                                    {errors.gender && touched.gender ? (<Typography variant="subtitle1" color="error">{errors.gender}</Typography>) : null}

                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="height"
                                        name="height"
                                        label="Height (cm)"
                                        type="number"
                                        value={values.height}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <Height />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.height && touched.height ? (<Typography variant="subtitle1" color="error">{errors.height}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="weight"
                                        name="weight"
                                        label="Weight (kg)"
                                        type="number"
                                        value={values.weight}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <MonitorWeight />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.weight && touched.weight ? (<Typography variant="subtitle1" color="error">{errors.weight}</Typography>) : null}

                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="state"
                                        name="state"
                                        label="State"
                                        value={values.state}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <AddLocationAltRounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.state && touched.state ? (<Typography variant="subtitle1" color="error">{errors.state}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>

                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="city"
                                        name="city"
                                        label="City"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >
                                                    <LocationCityRounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.city && touched.city ? (<Typography variant="subtitle1" color="error">{errors.city}</Typography>) : null}
                                </Grid>

                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <FormControl variant='filled' fullWidth>
                                        <InputLabel color='secondary'>Coach</InputLabel>
                                        <Select
                                            size='small'
                                            color='secondary'
                                            id="coachName"
                                            name="coachName"
                                            label="CoachName"
                                            value={values.coachName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {coach?.map((data) => (
                                                <MenuItem key={data.coachName} value={data.coachName}>{data.coachName}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </FormControl>
                                    {errors.coachName && touched.coachName ? (<Typography variant="subtitle1" color="error">{errors.coachName}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="athleteName"
                                        name="athleteName"
                                        label="Name"
                                        value={category}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >
                                                    <CategoryRounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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

export default ProtectedRoute(EditAthelete,"coordinator")