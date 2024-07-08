import { Category, Close, EmojiEventsRounded } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AssignMatchApi, clearMessage } from '../../Redux/CoordinatorRedux';
import { toast } from 'react-toastify';
import { GetCoordinator, GetReferee } from '../Apis/Admin';
import { GetMatchById } from '../Apis/Coordinator';
import { useFormik } from 'formik';
import * as Yup from 'yup';  // Import Yup for validation schema
import ProtectedRoute from '../../ProtectedRoute';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AssignMatchSchema = Yup.object().shape({
    matchCoordinator: Yup.string().required('Coordinator is required'),
    referee1: Yup.string().required('Referee 1 is required'),
    referee2: Yup.string().required('Referee 2 is required'),
    referee3: Yup.string().required('Referee 3 is required'),
});

const AssignMatch = () => {
    const [coordinator, setCoordinator] = useState([]);
    const [referee, setReferee] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error } = useSelector((state) => state.coordinator);

    const initial = {
        matchCoordinator: "",
        referee1: "",
        referee2: "",
        referee3: "",
    };

    const getMatchById = async () => {
        const response = await GetMatchById(id);
        if (response.data) {
            setValues(response.data);
        }
    };

    const getReferee = async () => {
        const response = await GetReferee();
        if (response.data) {
            setReferee(response.data);
        }
    };

    const getCoordinator = async () => {
        const response = await GetCoordinator();
        if (response.data) {
            setCoordinator(response.data);
        }
    };

    useEffect(() => {
        getMatchById();
        getReferee();
        getCoordinator();
    }, []);
    
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

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: AssignMatchSchema,
        onSubmit: async (values) => {
            dispatch(AssignMatchApi({ values, id }));
          
        },
    });

    const handleClose = () => {
        navigate("/coordinator/match");
    };

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={true}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Assign Match
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
                            <Grid item lg={12} md={12} sm={12} xs={12} xl={12}>
                                <FormControl variant='filled' fullWidth>
                                    <InputLabel color='secondary'>Coordinator</InputLabel>
                                    <Select
                                        id="matchCoordinator"
                                        name="matchCoordinator"
                                        label="Coordinator"
                                        fullWidth
                                        color="secondary"
                                        value={values.matchCoordinator}
                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                    >
                                        {coordinator.map((data) => (
                                            <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {errors.matchCoordinator && touched.matchCoordinator ? (<Typography variant="subtitle1" color="error">{errors.matchCoordinator}</Typography>) : null}
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <FormControl variant='filled' fullWidth>
                                    <InputLabel color='secondary'>Referee 1</InputLabel>
                                    <Select
                                        id="referee1"
                                        name="referee1"
                                        color="secondary"
                                        variant="filled"
                                        value={values.referee1}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {referee.map((data) => (
                                            <MenuItem key={data.id} value={data.name} >{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {errors.referee1 && touched.referee1 ? (<Typography variant="subtitle1" color="error">{errors.referee1}</Typography>) : null}
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <FormControl variant='filled' fullWidth>
                                    <InputLabel color='secondary'>Referee 2</InputLabel>
                                    <Select
                                        id="referee2"
                                        name="referee2"
                                        label="Referee 2"
                                        color="secondary"
                                        variant="filled"
                                        value={values.referee2}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {referee.map((data) => (
                                            <MenuItem key={data.id} value={data.name} >{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {errors.referee2 && touched.referee2 ? (<Typography variant="subtitle1" color="error">{errors.referee2}</Typography>) : null}
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <FormControl variant='filled' fullWidth>
                                    <InputLabel color='secondary'>Referee 3</InputLabel>
                                    <Select
                                        id="referee3"
                                        name="referee3"
                                        label="Referee 3"
                                        color="secondary"
                                        variant="filled"
                                        value={values.referee3}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {referee.map((data) => (
                                            <MenuItem key={data.id} value={data.name} >{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {errors.referee3 && touched.referee3 ? (<Typography variant="subtitle1" color="error">{errors.referee3}</Typography>) : null}
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
    );
};

export default ProtectedRoute(AssignMatch,"coordinator");
