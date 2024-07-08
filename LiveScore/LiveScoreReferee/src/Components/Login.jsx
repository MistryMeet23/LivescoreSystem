
import './Css/Login.css'
import { useFormik } from 'formik';
import { login } from './Validation/Login';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { LoginApi, clearMessageLogin } from '../Redux/LoginRedux';
import { useEffect } from 'react';

const Login = () => {
  const dispatch = useDispatch()
  const { data, error } = useSelector((state) => state.login);
  const navigate = useNavigate()


  const initial = {
    email: "",
    password: ""
  }
  useEffect(() => {
    if (data && data.msg) {
      toast.success(data.msg)
      localStorage.setItem("ID", data.id)
      localStorage.setItem("Img", data.img)
      dispatch(clearMessageLogin())
      navigate("/dashboard")
    }
    if (error) {
      toast.error(error.msg)
      dispatch(clearMessageLogin())
    }
  }, [data, error, dispatch])


  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initial,
    validationSchema: login,

    onSubmit: async (values) => {
      dispatch(LoginApi(values))
    }

  })

  return (
    <div className="background">
      <div className="shape"></div>

      <form method="post" className='form' onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        <label htmlFor="username">Email</label>
        <input
          type="email"
          name='email'
          placeholder="Email or Phone"
          id="username"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && touched.email ? (<span style={{ color: "red" }}>{errors.email}</span>) : null}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="password"
          id="password"
          name='password'
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && touched.password ? (<span style={{ color: "red" }}>{errors.password}</span>) : null}

        <button type="submit">Log In</button>

        <div className="go" style={{ marginTop: "14px" }}>
          <Link to="findEmail" style={{ textDecoration: "none" }} variant="body2">
            Forget Password?
          </Link>

        </div>
      </form>
      <div className="shape"></div>
    </div>
  );
}

export default Login
