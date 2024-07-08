import { AlternateEmailRounded } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Grid, InputAdornment, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { findEmail } from '../Validation/Login';
import { useDispatch, useSelector } from 'react-redux';
import { FindEmailApi } from '../../Redux/LoginRedux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const FindEmail = () => {
  const theme = useTheme()
  const [msg, setMsg] = useState("")
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.login);

  const initialValue = {
    email: ""
  }

  useEffect(() => {
    if (data) {
      setMsg(data.msg)
    }
    if (error) {
      setMsg(error.msg)
    }
  }, [data, error, setMsg])



  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValue,
    validationSchema: findEmail,
    onSubmit: (values) => {
      dispatch(FindEmailApi(values.email))
    }
  })
  return (
    <React.Fragment>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Enter Email</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {
              loading ? <CircularProgress /> :
                <Grid container spacing={2}>
                  <Grid item sx={12} xl={12} md={12} lg={12} xs={12}>
                    <TextField
                      fullWidth
                      variant='standard'
                      id="email"
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText="Enter your email id to send forget password link to you email"
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
                  <Grid item sx={12} xl={12} md={12} lg={12} xs={12}>
                    <Typography variant="body" color="green">{msg}</Typography>
                  </Grid>
                </Grid>
            }
          </DialogContent>
          <DialogActions>
            <Button type="submit">Send</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}

export default FindEmail