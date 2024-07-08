import React, { useEffect, useState, forwardRef } from 'react';
import {
  Box, Button, FormControlLabel, FormLabel, Grid, InputAdornment, Paper, Radio, RadioGroup,
  TextField, Typography, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Avatar
} from '@mui/material';
import {
  AddLocationAltRounded, AddPhotoAlternateRounded, DateRangeRounded, LocationCityRounded,
  PermContactCalendarRounded, Person2Rounded
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { GetProfile } from './Apis';
import { UpdateProfileApi, UpdateProfilePicApi, clearMessage } from '../Redux/RefereeRedux';
import { UpdateProfile } from './Validation/Login';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Profile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.referee);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const cid = localStorage.getItem("ID");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getProfile = async () => {
    const response = await GetProfile(cid);
    if (response.data) {
      setValues(response.data);
      setImage(response.data.imageURL);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (data) {
      toast.success(data.msg);
      dispatch(clearMessage());
      getProfile();
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.msg);
      dispatch(clearMessage());
    }
  }, [error, dispatch]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateImage = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("ImageFile", selectedFile);
      dispatch(UpdateProfilePicApi({ values: formData, id: cid }));
      handleClose();
    } else {
      toast.error("Please First Select Image...");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
      dateOfBirth: "",
      gender: "",
      state: "",
      city: "",
    },
    validationSchema: UpdateProfile,
    onSubmit: async (values) => {
      dispatch(UpdateProfileApi({ id: cid, values }));
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = formik;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" color="initial">Profile</Typography>
      </Box>
      <Grid container spacing={2} sx={{ mt: "1%" }}>
        <Grid item xl={4} md={4} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: "#141c33" }}>
          <Box
            component="img"
            sx={{
              height: { xs: 150, md: 167, lg: 250, sm: 500 },
              width: { xs: 150, md: 100, lg: 230, sm: 480 },
              borderRadius: "50%",
              boxShadow: "3px 3px 6px",
              mb: 2,
            }}
            alt="Profile"
            src={image ? `/ACR/${image}` : "https://via.placeholder.com/150"}
          />
          <Button variant="contained" fullWidth color="primary" onClick={handleClickOpen} sx={{ mt: 2,ml:"30%",mr:"30%" }}>
            Update Image
          </Button>
          <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogContent>
              <Avatar src={image ? `/ACR/${image}` : "https://via.placeholder.com/150"} sx={{ height: "12rem", width: "12rem", margin: "auto", boxShadow: "3px 3px 6px", mb: 2 }} />
              <TextField
                id="image"
                type="file"
                onChange={handleImage}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><AddPhotoAlternateRounded /></InputAdornment> }}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleUpdateImage} startIcon={<AddPhotoAlternateRounded />}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xl={8} md={8} sm={12} xs={12}>
          <Paper sx={{ padding: 3 }} elevation={1}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xl={12} sm={12} xs={12} lg={12}>
                  <TextField
                    label="Name"
                    size='small'
                    name='name'
                    type='text'
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    color="secondary"
                    variant='standard'
                    InputLabelProps={{ shrink: true }}
                    placeholder='Enter Name'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }}>
                          <Person2Rounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.name && touched.name && (
                    <Typography variant="subtitle1" color="error">{errors.name}</Typography>
                  )}
                </Grid>
                <Grid item xl={6} sm={12} xs={12} lg={6}>
                  <TextField
                    label="Contact"
                    variant="standard"
                    fullWidth
                    color='secondary'
                    type='number'
                    size='small'
                    name='contact'
                    value={values.contact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    placeholder='Enter Contact'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }}>
                          <PermContactCalendarRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.contact && touched.contact && (
                    <Typography variant="subtitle1" color="error">{errors.contact}</Typography>
                  )}
                </Grid>
                <Grid item xl={6} sm={12} xs={12} lg={6}>
                  <TextField
                    label="Date of birth"
                    variant="standard"
                    fullWidth
                    name='dateOfBirth'
                    color='secondary'
                    type='date'
                    size='small'
                    value={dayjs(values.dateOfBirth).format('YYYY-MM-DD')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    placeholder='Enter Date of Birth'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }}>
                          <DateRangeRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.dateOfBirth && touched.dateOfBirth && (
                    <Typography variant="subtitle1" color="error">{errors.dateOfBirth}</Typography>
                  )}
                </Grid>
                <Grid item xl={12} sm={12} xs={12} lg={12}>
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    id="gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <FormControlLabel value="Male" control={<Radio size='small' />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio size='small' />} label="Female" />
                    <FormControlLabel value="Other" control={<Radio size='small' />} label="Other" />
                  </RadioGroup>
                  {errors.gender && touched.gender && (
                    <Typography variant="subtitle1" color="error">{errors.gender}</Typography>
                  )}
                </Grid>
                <Grid item xl={6} sm={12} xs={12} lg={6}>
                  <TextField
                    label="State"
                    variant="standard"
                    fullWidth
                    color='secondary'
                    size='small'
                    name='state'
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    placeholder='Enter State'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }}>
                          <AddLocationAltRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.state && touched.state && (
                    <Typography variant="subtitle1" color="error">{errors.state}</Typography>
                  )}
                </Grid>
                <Grid item xl={6} sm={12} xs={12} lg={6}>
                  <TextField
                    label="City"
                    name='city'
                    variant="standard"
                    fullWidth
                    color='secondary'
                    size='small'
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    placeholder='Enter City'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: theme.palette.primary.dark }}>
                          <LocationCityRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.city && touched.city && (
                    <Typography variant="subtitle1" color="error">{errors.city}</Typography>
                  )}
                </Grid>
                <Grid item xl={12} sm={12} xs={12} lg={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
