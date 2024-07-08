// import { makeStyles } from '@mui/styles';
import { Button, Grid, Paper, TextField, useTheme, Typography, InputAdornment, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Input } from '@mui/material'
import React, { useEffect, useState } from 'react'
import registration from "../Images/register.jpg"
import { AccessibilityNewRounded, AddLocationAltRounded, AddPhotoAlternateRounded, AlternateEmailRounded, ArrowBackIosNewRounded, DateRangeRounded, LocationCityRounded, PatternRounded, PermContactCalendarRounded, Person2Rounded, Visibility, VisibilityOff } from '@mui/icons-material'
import { useFormik } from 'formik'
import { acr, } from '../Validation/Coordinator'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { CoordinatorPostApi } from '../../Redux/CoordinatorRedux'




const RegisterCoordinator = () => {
    const theme = useTheme()
    const { data, error, } = useSelector((state) => state.coordinator);
    const dispatch = useDispatch()


    const [type, setType] = useState("password")
    const [visible, setVisible] = useState(false)
    const icon = (visible ? <Visibility color='secondary' /> : <VisibilityOff color='secondary' />)
    const showClick = () => {
        if (visible === false) {
            setVisible(true)
            setType("text")
        }
        else {
            setVisible(false)
            setType("password")
        }
    }

    const initial = {
        name: "",
        email: "",
        password: "",
        contact: "",
        dateOfBirth: "",
        image: null,
        gender: "",
        state: "",
        city: "",
    }

    const navigate = useNavigate()
    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            navigate("/")
        }
        if (error) {
            toast.error(error.msg)
        }
    }, [data, error,navigate,toast])


    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: initial,
        validationSchema: acr,
        onSubmit: async (values) => {
            console.log(values)
            const formData = new FormData();
            formData.append('ImageFile', values.image); // Assuming you have ImageFile in your form values
            formData.append('Email', values.email);
            formData.append('Name', values.name);
            formData.append('Password', values.password);
            formData.append('Contact', values.contact);
            formData.append('DateOfBirth', values.dateOfBirth);
            formData.append('Gender', values.gender);
            formData.append('City', values.city);
            formData.append('State', values.state);
            dispatch(CoordinatorPostApi(formData))
        }
    })

    const handleImageChange = (event) => {
        // Extract the file from the event object
        const file = event.target.files[0];

        // Set the file in formik values
        setFieldValue('image', file);
    };



    return (
        <Grid container sx={{
            // height: '100vh',
            height: "auto",
            width: "80vw",
            margin: "2% auto 2% auto",
            padding: "20px",
            borderRadius: "30px",
            justifyContent: 'center',

        }}>
        <Grid item xl={12} md={12} sm={12} xs={12}>
            <Typography variant="button" component={Link} to="/" color="initial" sx={{ textDecoration:"none", textAlign:"center"}}><ArrowBackIosNewRounded fontSize='inherit' />Back</Typography>
        </Grid>
            <Grid item xl={6} xs={false} sm={false} sx={{ backgroundImage: `url(${registration})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}  >
            </Grid>
            <Grid item xs={12} xl={6} sm={6}   >
                {/* Form Section */}
                <Paper sx={{
                    padding: 4,
                }}
                    elevation={1}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <Typography variant="h4" color={theme.palette.secondary.light} sx={{ textAlign: "center" }}>Register</Typography>
                            </Grid>
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <TextField
                                    label="Name"
                                    size='small'
                                    name='name'
                                    type='text'
                                    fullWidth
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    color="secondary"
                                    // sx={{ marginBottom: "15px" }}
                                    variant='standard'
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter Name'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >

                                                <Person2Rounded />
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                                {errors.name && touched.name ? (<Typography variant="subtitle1" color="error">{errors.name}</Typography>) : null}
                            </Grid>
                            <Grid item xl={6} sm={12} xs={12} lg={6}  >
                                <TextField
                                    label="Email"
                                    size='small'
                                    variant="standard"
                                    fullWidth
                                    name='email'
                                    color='secondary'
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter Email'
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
                            <Grid item xl={6} sm={12} xs={12} lg={6} >
                                <TextField
                                    label="Password"
                                    size='small'
                                    name='password'
                                    type={type}
                                    variant="standard"
                                    fullWidth
                                    color='secondary'
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter Password'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >

                                                <PatternRounded />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (<InputAdornment position="end"> <IconButton onClick={showClick}>
                                            {icon}
                                        </IconButton> </InputAdornment>)
                                    }}

                                />
                                {errors.password && touched.password ? (<Typography variant="subtitle1" color="error">{errors.password}</Typography>) : null}
                            </Grid>
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <TextField
                                    label="Contact"
                                    variant="standard"
                                    fullWidth
                                    color='secondary'
                                    type='number'
                                    size='small'
                                    name='contact'
                                    value={values.contact}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter Contact'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >

                                                <PermContactCalendarRounded />
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                                {errors.contact && touched.contact ? (<Typography variant="subtitle1" color="error">{errors.contact}</Typography>) : null}
                            </Grid>
                           
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <TextField
                                    label="Date fo birth"
                                    variant="standard"
                                    fullWidth
                                    name='dateOfBirth'
                                    color='secondary'
                                    type='date'
                                    size='small'
                                    value={values.dateOfBirth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter Date of Birth'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                <DateRangeRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {errors.dateOfBirth && touched.dateOfBirth ? (<Typography variant="subtitle1" color="error">{errors.dateOfBirth}</Typography>) : null}
                            </Grid>
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <FormLabel component="legend">Upload Image</FormLabel>
                                <Input
                                    id="image-upload"
                                    label="Image"
                                    variant="standard"
                                    name='image'
                                    size='small'
                                    fullWidth
                                    color='secondary'
                                    type='file'
                                    inputProps={{ accept: 'image/*' }}
                                    // style={{ display: 'none' }} 
                                    //sx={{ marginBottom: "15px" }}
                                    // value={values.image}
                                    onBlur={handleBlur}
                                    onChange={handleImageChange}
                                />
                                {/* <label htmlFor="image-upload">
                                    <Button variant="contained" component="span">
                                        <AddPhotoAlternateRounded /> Upload Image
                                    </Button>
                                </label> */}
                                {errors.image && touched.image ? (<Typography variant="subtitle1" color="error">{errors.image}</Typography>) : null}
                            </Grid>
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="gender"

                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue="male"

                                >
                                    <FormControlLabel value="male" control={<Radio size='small' />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio size='small' />} label="Female" />
                                    <FormControlLabel value="other" control={<Radio size='small' />} label="Other" />
                                </RadioGroup>
                                {errors.gender && touched.gender ? (<Typography variant="subtitle1" color="error">{errors.gender}</Typography>) : null}
                            </Grid>
                            <Grid item xl={6} sm={12} xs={12} lg={12} >
                                <TextField
                                    label="state"
                                    variant="standard"
                                    fullWidth
                                    color='secondary'
                                    size='small'
                                    name='state'
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter State'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >

                                                <AddLocationAltRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {errors.state && touched.state ? (<Typography variant="subtitle1" color="error">{errors.state}</Typography>) : null}
                            </Grid>
                            <Grid item xl={6} sm={12} xs={12} lg={12} >
                                <TextField
                                    label="city"
                                    name='city'
                                    variant="standard"
                                    fullWidth
                                    color='secondary'
                                    size='small'
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Enter City'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                <LocationCityRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {errors.city && touched.city ? (<Typography variant="subtitle1" color="error">{errors.city}</Typography>) : null}
                            </Grid>
                            <Grid item xl={12} sm={12} xs={12} lg={12} >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth >
                                    Register
                                </Button>
                            </Grid>
                        </Grid>


                    </form>
                </Paper>
            </Grid>
        </Grid>
        // <div>RegisterCoordinator</div>
    )
}

export default RegisterCoordinator