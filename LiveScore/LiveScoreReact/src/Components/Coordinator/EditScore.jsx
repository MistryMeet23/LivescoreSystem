import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField, Typography, styled } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ScorePutApi, clearMessage } from '../../Redux/CoordinatorRedux';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { GetTemporaryScoreById } from '../Apis/Coordinator';
import Close from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { Gavel, SportsGymnasticsRounded } from '@mui/icons-material';




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditScore = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()

    const { data, error } = useSelector(state => state.coordinator)

     const initial = {
        redPoints: "",
        bluePoints: "",
        redPanelty: "",
        bluePanelty: "",
    }

    const getTemporaryScoreById = async () => {
        const { data } = await GetTemporaryScoreById(id)
        data && setValues(data)
    }

    useEffect(() => {
        getTemporaryScoreById()
    }, [])

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        onSubmit: async (values) => {
            dispatch(ScorePutApi({  id,values }))

        }
    })

    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch(clearMessage())
            navigate("/coordinator/ReviewMatch")
        }
        if (error) {
            toast.error(error.msg)
            dispatch(clearMessage())
        }
    }, [data, error, navigate, dispatch])

    const handleClose = () => {
        navigate("/coordinator/ReviewMatch")
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
                        Edit Score
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
                                        id="redPoints"
                                        name="redPoints"
                                        label="Red Points"
                                        variant='standard'
                                        value={values.redPoints}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >
                                                    <SportsGymnasticsRounded color="error" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.redPoints && touched.redPoints ? (<Typography variant="subtitle1" color="error">{errors.redPoints}</Typography>) : null}
                                </Grid>

                                <Grid item xl={12} md={6} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        id="bluePoints"
                                        name="bluePoints"
                                        label="Blue Points"
                                        variant='standard'
                                        value={values.bluePoints}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                                                    <SportsGymnasticsRounded color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.bluePoints && touched.bluePoints ? (<Typography variant="subtitle1" color="error">{errors.bluePoints}</Typography>) : null}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>

                                    <TextField
                                        fullWidth
                                        id="redPanelty"
                                        name="redPanelty"
                                        label="redPaneltys"
                                        variant='standard'
                                        value={values.redPanelty}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <Gavel color='error' />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.redPanelty && touched.redPanelty ? (<Typography variant="subtitle1" color="error">{errors.redPanelty}</Typography>) : null}

                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>

                                    <TextField
                                        fullWidth
                                        id="bluePanelty"
                                        name="bluePanelty"
                                        label="Achivements"
                                        variant='standard'
                                        value={values.bluePanelty}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: theme.palette.secondary.dark }} >

                                                    <Gavel color='primary' />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.bluePanelty && touched.bluePanelty ? (<Typography variant="subtitle1" color="error">{errors.bluePanelty}</Typography>) : null}
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

export default EditScore