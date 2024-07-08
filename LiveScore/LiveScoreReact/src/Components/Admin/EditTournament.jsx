import { Close, DateRangeRounded, LocationOn, Person2Rounded} from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment,  InputLabel,  MenuItem,  Select,  TextField, Typography, styled, useTheme } from '@mui/material';
import React, { useState } from 'react'
import {  upTournament } from '../Validation/Admin';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { GetCoordinator, GetTournamentById } from '../Apis/Admin';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { TournamentPutApi, clearMessageAdmin } from '../../Redux/AdminRedux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import ProtectedRoute from '../../ProtectedRoute';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditTournament = () => {

    const [coordinator, setCoordinator] = useState()
    const theme = useTheme()    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const { data, error } = useSelector((state) => state.admin)

    const initial = {
        tournamentName: "",
        venue: "",
        tournamentDate: "",
        coordinatorName: ""
    }

    const getCoordinator = async () => {
      const { data } = await GetCoordinator()
        data && setCoordinator(data)
    }

    const getTournamentByid = async () => {
      const { data } = await GetTournamentById(id)
        data && setValues(data)
    }
    
     useEffect(() => {
        getTournamentByid()
        getCoordinator()
    }, [])


    
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        validationSchema: upTournament,
        onSubmit: async (values) => {
            dispatch(TournamentPutApi({values, id}))
        }
    })

    useEffect(() => {
        if (data) {
            toast.success(data.msg);
            navigate("/admin/mtournament");
            dispatch(clearMessageAdmin());
        }
        if (error) {
            toast.error(error.msg);
            dispatch(clearMessageAdmin());
        }
    }, [data, error, navigate, dispatch]);

    const handleClose = () => {
        navigate("/admin/mtournament")
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
                        Edit Tournament
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
                                        variant='standard'
                                        id="name"
                                        name="tournamentName"
                                        label="Tournament Name"
                                        value={values.tournamentName}
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
                                    {errors.tournamentName && touched.tournamentName ? (<Typography variant="subtitle1" color="error">{errors.tournamentName}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="venue"
                                        name="venue"
                                        label="Venue"
                                        value={values.venue}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >
                                                    <LocationOn />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.venue && touched.venue ? (<Typography variant="subtitle1" color="error">{errors.venue}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        variant='standard'
                                        id="date"
                                        name="tournamentDate"
                                        label="Tournament Date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}                                        
                                        value={dayjs(values.tournamentDate).format('YYYY-MM-DD')}
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
                                    {errors.tournamentDate && touched.tournamentDate ? (<Typography variant="subtitle1" color="error">{errors.tournamentDate}</Typography>) : null}
                                </Grid>
                                <Grid item xl={12} md={12} sm={12} xs={12}>
                                    <FormControl variant='filled' fullWidth>
                                        <InputLabel color='secondary'>Coordinator</InputLabel>
                                        <Select
                                            color='secondary'
                                            id="coordinatorName"
                                            name="coordinatorName"
                                            label="coordinatorName"
                                            value={values.coordinatorName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {coordinator?.map((data) => (
                                                <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </FormControl>
                                    {errors.coordinatorName && touched.coordinatorName ? (<Typography variant="subtitle1" color="error">{errors.coordinatorName}</Typography>) : null}
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

export default ProtectedRoute(EditTournament,"admin")