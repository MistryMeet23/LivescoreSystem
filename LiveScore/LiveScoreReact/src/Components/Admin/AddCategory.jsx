import { ChildCare, Close, MonitorWeight, Person2Rounded } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField, Typography, styled, useTheme } from '@mui/material';
import React from 'react'
import { category } from '../Validation/Admin';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
// import { CategoryPostApi, getCategoryApi } from '../../Redux/Action/AdminAction';
import ProtectedRoute from '../../ProtectedRoute';
import { CategoryPostApi } from '../../Redux/AdminRedux';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddCategory = () => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme()
    const dispatch = useDispatch()
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const initial = {
        categoryName: "",
        minAge: "",
        maxAge: "",
        minWeight: "",
        maxWeight: "",
    }

    const { values, touched, errors, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initial,
        validationSchema: category,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                dispatch(CategoryPostApi(values))
                setSubmitting(false)
                resetForm({ values: "" });
            } catch (error) {
                <CircularProgress />
            }
        },
    })

    return (
        <div>
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Add Category
                </Button>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Add Category
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
                                <Grid item xl={12} md={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="categoryName"
                                        label="category Name"
                                        value={values.categoryName}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant='standard'
                                        InputProps={{
                                            style: { textTransform: "capitalize" },
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >
                                                    <Person2Rounded />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {errors.categoryName && touched.categoryName ? (<Typography variant="subtitle1" color="error">{errors.categoryName}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="minAge"
                                        name="minAge"
                                        label="Minimum Age"
                                        type='number'
                                        value={values.minAge}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant='standard'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <ChildCare />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.minAge && touched.minAge ? (<Typography variant="subtitle1" color="error">{errors.minAge}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="maxAge"
                                        name="maxAge"
                                        label="Maximum Age"
                                        type='number'
                                        value={values.maxAge}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant='standard'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <ChildCare />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.maxAge && touched.maxAge ? (<Typography variant="subtitle1" color="error">{errors.maxAge}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="minWeight"
                                        name="minWeight"
                                        label="Minimum Weight"
                                        type='number'
                                        value={values.minWeight}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant='standard'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <MonitorWeight />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.minWeight && touched.minWeight ? (<Typography variant="subtitle1" color="error">{errors.minWeight}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="time"
                                        name="maxWeight"
                                        label="Maximum Weight"
                                        type='number'
                                        value={values.maxWeight}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant='standard'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <MonitorWeight />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.maxWeight && touched.maxWeight ? (<Typography variant="subtitle1" color="error">{errors.maxWeight}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12}>
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
export default ProtectedRoute(AddCategory, 'admin')
