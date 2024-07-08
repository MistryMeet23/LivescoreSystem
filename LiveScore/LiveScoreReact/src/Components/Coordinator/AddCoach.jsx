import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { TextField, Button, Grid, Typography, RadioGroup, FormControlLabel, Radio, FormLabel, CircularProgress, InputAdornment } from '@mui/material';
import { CoachValidate } from '../Validation/Coordinator';
import { AlternateEmailRounded, EmojiEvents, PermContactCalendarRounded, Person2Rounded, Stars } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { CoachPostApi } from '../../Redux/CoordinatorRedux';
import ProtectedRoute from '../../ProtectedRoute';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddCoach = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);

    const initial = {
        name: "",
        email: "",
        contact: "",
        gender: "",
        experience: "",
        achievement: "",
        image: null,
    }

    const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: initial,
        validationSchema: CoachValidate,
        onSubmit: async (values) => {
            try {
                const formdata = new FormData()
                formdata.append('CoachName', values.name)
                formdata.append('CoachEmail', values.email)
                formdata.append('ContactNo', values.contact)
                formdata.append('Gender', values.gender)
                formdata.append('Achievements', values.achievement)
                formdata.append('Experience', values.experience)
                formdata.append('ImageFile', values.image)

                 dispatch(CoachPostApi(formdata))
            } catch (error) {
                <CircularProgress />
            }
        },

    })

    const handleFile = (e) => {
        const file = e.target.files[0]
        setFieldValue('image', file)
    }

    

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Add Coach
                </Button>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Add Coach
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
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xl={12} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label="Name"
                                        variant='standard'
                                        value={values.name}
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
                                    {errors.name && touched.name ? (<Typography variant="subtitle1" color="error">{errors.name}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant='standard'
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
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <FormLabel component="legend">Upload Image</FormLabel>
                                    <input
                                        id="image-upload"
                                        label="Image"
                                        name='image'
                                        type="file"
                                        onChange={handleFile}
                                        onBlur={handleBlur}

                                    />
                                    {errors.image && touched.image ? (<Typography variant="subtitle1" color="error">{errors.image}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
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
                                        id="achievement"
                                        name="achievement"
                                        label="Achievements"
                                        variant='standard'
                                        value={values.achievement}
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
                                    {errors.achievement && touched.achievement ? (<Typography variant="subtitle1" color="error">{errors.achievement}</Typography>) : null}
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
    )
}

export default ProtectedRoute(AddCoach,"coordinator")
