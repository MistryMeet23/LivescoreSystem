import {  VpnKeyRounded } from '@mui/icons-material'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, Slide, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ForgetPasswordApi, clearMessageLogin } from '../Redux/LoginRedux';
import { forgetPassword } from './Validation/Login';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ForgetPassword = () => {
  const { email } = useParams()
  const theme = useTheme()
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.login);

  const initialValue = {
    password: ""
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (data && data.msg) {
      toast.success(data.msg)
      dispatch(clearMessageLogin())
      navigate("/")
    }
    if (error) {
      toast.error(error.msg)
      dispatch(clearMessageLogin())
    }
  }, [data, error, navigate, dispatch])





  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValue,
    validationSchema: forgetPassword,
    onSubmit: (values) => {
      const formData = new FormData()
      formData.append("Email", email)
      formData.append("Password", values.password)
      dispatch(ForgetPasswordApi(formData))
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
        <DialogTitle>Forget Password</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {
              loading ? <CircularProgress /> :
                <Grid container spacing={2}>
                  <Grid item sx={12} xl={12} md={12} lg={12} xs={12}>
                    <TextField
                      fullWidth
                      variant='standard'
                      id="password"
                      name="password"
                      label="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }} >
                            <VpnKeyRounded />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors.password && touched.password ? (<Typography variant="subtitle1" color="error">{errors.password}</Typography>) : null}
                  </Grid>
                </Grid>
            }
          </DialogContent>
          <DialogActions>
            <Button type="submit">Reset Password</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}

export default ForgetPassword