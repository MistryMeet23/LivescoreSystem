import { AlternateEmailRounded, Close, EmojiEvents, PermContactCalendarRounded, Person2Rounded, Stars } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { UpCoach } from '../Validation/Coordinator';
import { GetCoachById } from '../Apis/Coordinator';
import { CoachPutApi, clearMessage } from '../../Redux/CoordinatorRedux';
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

const EditCoach = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const { data, error } = useSelector(state => state.coordinator)
    const initial = {
        coachName: "",
        coachEmail: "",
        contactNo: "",
        gender: "",
        experience: "",
        achievements: "",
    }

    const getCoach = async () => {
        const { data } = await GetCoachById(id)
        data && setValues(data)
    }

    useEffect(() => {
        getCoach()
    }, [])

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: UpCoach,
        onSubmit: async (values) => {
            dispatch(CoachPutApi({ values, id }))

        }
    })

    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch(clearMessage())
            navigate("/coordinator/coach")
        }
        if (error) {
            toast.error(error.msg)
            dispatch(clearMessage())
        }
    }, [data, error, navigate, dispatch])

    const handleClose = () => {
        navigate("/coordinator/coach")
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
                        Edit Coach
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
                                <Grid item xl={12} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        id="coachName"
                                        name="coachName"
                                        label="Name"
                                        variant='standard'
                                        value={values.coachName}
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
                                    {errors.coachName && touched.coachName ? (<Typography variant="subtitle1" color="error">{errors.coachName}</Typography>) : null}
                                </Grid>

                                <Grid item xl={12} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        id="coachEmail"
                                        name="coachEmail"
                                        label="Email"
                                        variant='standard'
                                        value={values.coachEmail}
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
                                    {errors.coachEmail && touched.coachEmail ? (<Typography variant="subtitle1" color="error">{errors.coachEmail}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12} xs={12}>

                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="contactNo"
                                        name="contactNo"
                                        label="Contact"
                                        type="number"
                                        value={values.contactNo}
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
                                    {errors.contactNo && touched.contactNo ? (<Typography variant="subtitle1" color="error">{errors.contactNo}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12} xs={12}>
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="gender"
                                        id="gender"
                                        name="gender"
                                        size='small'
                                        variant='standard'
                                        value={values.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                    {errors.gender && touched.gender ? (<Typography variant="subtitle1" color="error">{errors.gender}</Typography>) : null}

                                </Grid>

                                <Grid item xl={6} md={6} sm={12} xs={12}>

                                    <TextField
                                        fullWidth
                                        id="achievements"
                                        name="achievements"
                                        label="Achivements"
                                        variant='standard'
                                        value={values.achievements}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <EmojiEvents />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.achievements && touched.achievements ? (<Typography variant="subtitle1" color="error">{errors.achievements}</Typography>) : null}
                                </Grid>

                                <Grid item xl={6} md={6} sm={12} xs={12}>

                                    <TextField
                                        fullWidth
                                        id="experience"
                                        name="experience"
                                        label="Experiences"
                                        variant='standard'
                                        value={values.experience}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <Stars />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.experience && touched.experience ? (<Typography variant="subtitle1" color="error">{errors.experience}</Typography>) : null}

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

export default ProtectedRoute(EditCoach,"coordinator")