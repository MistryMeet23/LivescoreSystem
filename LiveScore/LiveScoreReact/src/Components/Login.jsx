import { useEffect, useState } from 'react';
import loginImg from "./Images/login.jpg";
import { useFormik } from "formik";
import {
  Visibility,
  VisibilityOff,
  MailLockRounded,
  VpnKeyRounded, // Fix typo here
} from "@mui/icons-material";
import {
  Grid,
  Typography,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Button,
  Paper,
} from '@mui/material';
import { login } from './Validation/Login.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { LoginApi, clearMessageLogin } from '../Redux/LoginRedux.js';



const Login = () => {

  // getting state from  reducer
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.login);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // making initial state 
  const initialValues = {
    email: '',
    password: '',
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      toast.success(data.msg)
      localStorage.setItem('token', data.token);
      localStorage.setItem("Img", data.img)
      if (data.role === 2) {
        localStorage.setItem('role', "admin");
        localStorage.setItem('ID', data.id)
        dispatch(clearMessageLogin())
        navigate("/admin/adashboard")
      }

      if (data.role === 3) {
        localStorage.setItem('role', "coordinator");
        localStorage.setItem('ID', data.id)
        dispatch(clearMessageLogin())
        navigate("/coordinator/cdashboard")
      }
    }

    if (error) {
      toast.error(error.msg)
      dispatch(clearMessageLogin())
    }
    if (loading) {
      setIsSubmitting(true)
    }
  }, [data, error, dispatch])

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: login,
    onSubmit: (values, { resetForm, }) => {
      setIsSubmitting(true)
      dispatch(LoginApi(values))
      resetForm({ values: "" });
      setIsSubmitting(false)
    },
  });

  // making password show and hide button 
  const [type, setType] = useState("password");
  const [visible, setVisible] = useState(false);
  const icon = visible ? <Visibility sx={{ color: "#212c9f" }} /> : <VisibilityOff sx={{ color: "#212c9f" }} />;
  const showClick = () => {
    if (visible === false) {
      setVisible(true);
      setType("text");
    } else {
      setVisible(false);
      setType("password");
    }
  };

  return (
    <Grid container
      sx={{ minHeight: "100vh", width: "100vw" }}>
      <Grid item xs={false} sm={false} lg={6} sx={{ backgroundImage: `url(${loginImg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} component={Paper} square>
        <Box alignItems="center" maxWidth="md" sx={{ my: {lg:18,md:12,sm:18,xs:5}, mx:{lg:10,md:20,sm:10,xs:0}, p: 5, display: 'flex', flexDirection: 'column' }} >

          <Typography component="h1" sx={{ fontFamily: "unset", color: "#212c9f", textAlign: "center" }} variant="h3">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                color='secondary'
                sx={{ marginBottom: "15px" }}
                size='medium'
                label="Email"
                type='email'
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                InputLabelProps={{ shrink: true }}
                placeholder='Enter Your Email'
                variant='standard'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailLockRounded sx={{ color: "#212c9f" }} />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.email && touched.email ? <Typography variant='caption' color="error">{errors.email}</Typography> : null}
              <TextField
                sx={{ marginBottom: "10px" }}
                fullWidth
                id="password"
                size='medium'
                label="Password"
                type={type}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                InputLabelProps={{ shrink: true }}
                color='secondary'
                placeholder='Enter Your Password'
                variant='standard'
                name='password'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" >
                      <VpnKeyRounded sx={{ color: "#212c9f" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end"> <IconButton onClick={showClick}>
                      {icon}
                    </IconButton> </InputAdornment>)
                }}
              />
              {errors.password && touched.password ? <Typography variant="caption" color="error">{errors.password}</Typography> : null}

              <Button variant="contained" type='submit' fullWidth disabled={isSubmitting} sx={{ color: "White", background: "#212c9f" }}>
                Submit
              </Button>
            </form>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: "2vh" }}>

              <Link to="findEmail" style={{ textDecoration: "none" }} variant="body2">
                Forget password?
              </Link>

              <Link to="cRegister" style={{ textDecoration: "none" }} variant="body2">
                Register Coordinator
              </Link>

            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
