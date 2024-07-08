import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Fab, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { Fragment } from 'react';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { GetTemporaryScoreById } from '../Apis/Coordinator';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ReviewMatchApi, ScorePutApi, clearMessage } from '../../Redux/CoordinatorRedux';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { Close, DriveFileRenameOutlineRounded, Gavel, SportsGymnasticsRounded } from '@mui/icons-material';
import {  useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
function CustomNoRowsOverlay() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50%'
    }}>
      <Typography>No Score Added</Typography>
    </div>
  );
}

const EditScore = ({id ,mid}) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    // const { id } = useParams()
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

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initial,
        onSubmit: async (values) => {
            dispatch(ScorePutApi({  id,values,mid })) 
            dispatch(ReviewMatchApi())         
        }
    })

    useEffect(() => {
        if (data && data.msg) {
            toast.success(data.msg)
            dispatch(clearMessage())
            dispatch(ReviewMatchApi())
        }
        if (error) {
            toast.error(error.msg)
            dispatch(clearMessage())
        }
    }, [data, error, navigate, dispatch])


     const handleClickOpen = () => {
         getTemporaryScoreById()
        setOpen(true);
    };
    const handleClose = async () => {
        setOpen(false);
        dispatch(ReviewMatchApi())
    };
  return (
    <div>
            <React.Fragment>
               <Fab variant="extended" size="small" color="warning" sx={{ fontSize: '0.75rem', ml: 1 }} onClick={handleClickOpen}>
                <DriveFileRenameOutlineRounded size="small" sx={{ mr: "1px" }} /> 
              </Fab>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
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
                                        label="Blue Panelty"
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

const ReviewMatch = ({mid}) => {
    const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const { data, error,reviewMatch,loading } = useSelector(state => state.coordinator);

  useEffect(() => {
    if (data) {
      toast.success(data.msg)
      dispatch((clearMessage()))
    }
    if (error) {
      toast.error(error.msg)
      dispatch((clearMessage()))
    }
  }, [data, error])

const columns = useMemo(() => [
    {
      headerName: "Edit", width: 30, headerClassName: "header", headerAlign: "center", align: "center", renderCell: params => {
        return (
          <Box>
            <Tooltip title="Edit">
                <EditScore id={`${params.row.tempScoreId}`} mid={mid} />
            </Tooltip>
          </Box>
        )
      }
    },
    { field: "redPoints", headerName: "RedPoints", width: 90, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "bluePoints", headerName: "BluePoints", width: 90, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "redPanelty", headerName: "RedPanelty", width: 90, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "bluePanelty", headerName: "BluePenalty", width: 90, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "scoreTime", headerName: "ScoreTime", width: 170, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY  HH:mm:ss') : '------' },
    
  ], []);

    const handleClickOpen = () => {
        // getTempScore() 
        setOpen(true);
    dispatch(ReviewMatchApi())
    };
    const handleClose = () => {
        setOpen(false);
    };

  return (
     <Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                   Review
                </Button>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Manage Temporary Score
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
                        {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        {reviewMatch && reviewMatch.length > 0 ? (
                          <Box>
                            
                            <DataGrid
                              rows={reviewMatch}
                              columns={columns}
                              getRowId={(row) => row.tempScoreId}
                              rowHeight={54}
                              rowSelection="true"
                              rowSpacingType='margin'
                              scrollbarSize={1}
                              columnHeaderHeight={37}
                              pageSize={5}
                              rowsPerPageOptions={[5]}
                            />
                          </Box>
                        ) : (
                          <CustomNoRowsOverlay />
                        )}
                      </>
                    )}
                    </DialogContent>

                </BootstrapDialog>
            </Fragment>
  )
}

export default ReviewMatch