import { ChildCare, Close, MonitorWeight, Person2Rounded } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { category } from '../Validation/Admin';
import { GetCategoryById } from '../Apis/Admin';
import { CategoryPutApi, clearMessageAdmin } from '../../Redux/AdminRedux';
import ProtectedRoute from '../../ProtectedRoute';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditCategory = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error } = useSelector((state) => state.admin);
    const initial = {
        categoryName: "",
        minAge: "",
        maxAge: "",
        minWeight: "",
        maxWeight: "",
    };

    const getCategoryById = async () => {
        const { data } = await GetCategoryById(id);
        data && setValues(data);
    };

    useEffect(() => {
        getCategoryById();
    }, []);

    const { values, touched, errors, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: category,
        onSubmit: (values) => {
            dispatch(CategoryPutApi({ values, id }));
        },
    });

    useEffect(() => {
        if (data) {
            toast.success(data.msg);
            navigate("/admin/category");
            dispatch(clearMessageAdmin());
        }
        if (error) {
            toast.error(error.msg);
            dispatch(clearMessageAdmin());
        }
    }, [data, error, navigate, dispatch]);

    const handleClose = () => {
        navigate("/admin/category");
    };

    return (
        <div>
            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={true}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Edit Category
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
                    </DialogTitle>
                    <DialogContent dividers>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xl={12} md={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="categoryName"
                                        name="categoryName"
                                        label="Category Name"
                                        value={values.categoryName}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="standard"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                    <Person2Rounded />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.categoryName && touched.categoryName ? (
                                        <Typography variant="subtitle1" color="error">
                                            {errors.categoryName}
                                        </Typography>
                                    ) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="minAge"
                                        name="minAge"
                                        label="Minimum Age"
                                        type="number"
                                        value={values.minAge}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="standard"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                    <ChildCare />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.minAge && touched.minAge ? (
                                        <Typography variant="subtitle1" color="error">
                                            {errors.minAge}
                                        </Typography>
                                    ) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="maxAge"
                                        name="maxAge"
                                        label="Maximum Age"
                                        type="number"
                                        value={values.maxAge}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="standard"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                    <ChildCare />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.maxAge && touched.maxAge ? (
                                        <Typography variant="subtitle1" color="error">
                                            {errors.maxAge}
                                        </Typography>
                                    ) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="minWeight"
                                        name="minWeight"
                                        label="Minimum Weight"
                                        type="number"
                                        value={values.minWeight}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="standard"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                    <MonitorWeight />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.minWeight && touched.minWeight ? (
                                        <Typography variant="subtitle1" color="error">
                                            {errors.minWeight}
                                        </Typography>
                                    ) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        id="maxWeight"
                                        name="maxWeight"
                                        label="Maximum Weight"
                                        type="number"
                                        value={values.maxWeight}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="standard"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }}>
                                                    <MonitorWeight />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.maxWeight && touched.maxWeight ? (
                                        <Typography variant="subtitle1" color="error">
                                            {errors.maxWeight}
                                        </Typography>
                                    ) : null}
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
    );
};

export default ProtectedRoute(EditCategory,"admin");
