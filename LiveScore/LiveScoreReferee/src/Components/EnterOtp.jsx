import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { InsertLink } from '@mui/icons-material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useDispatch, useSelector } from 'react-redux';
import { validateOtpApi } from '../Redux/RefereeRedux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OtpTextField = styled((props) => (
  <MuiOtpInput {...props} TextFieldsProps={{ size: 'small', placeholder: "-" }} />
))(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    color: 'white',
  },
  '& .MuiInputBase-input': {
    color: 'white',
    textAlign: 'center',
  }
}));

const EnterOtp = ({ matchGroup }) => {
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.referee);
  const navigate = useNavigate();
  const rid = localStorage.getItem("ID");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (newValue) => {
    const numericValue = newValue.replace(/\D/g, '');
    setOtp(numericValue);
  };

  const handleComplete = (value) => {
    const formData = new FormData();
    formData.append('Otp', value);
    formData.append('MatchGroup', matchGroup);
    formData.append('RequestId', rid);
    dispatch(validateOtpApi(formData));
    setOtp('');
  };

  useEffect(() => {
    if (data) {
      if (data.msg) {
        toast.success(data.msg);
        navigate(`/scoring/${matchGroup}`);
      }
    }
    if (error) {
      toast.error(error.msg);
    }
  }, [data, error, navigate]);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        size="small"
        startIcon={<InsertLink />}
        sx={{ backgroundColor: "#060c1f", '&:hover': { backgroundColor: "#141c33" } }}
      >
        Join
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="customized-dialog-title" sx={{ color: "white", backgroundColor: "#141c33" }}>
          <Typography variant="h6" color="white">Join</Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#141c33" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="white">Enter Access Code</Typography>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              <OtpTextField
                autoFocus
                value={otp}
                onChange={handleChange}
                length={6}
                onComplete={handleComplete}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#141c33", float: "right" }}>
          <Button variant="text" sx={{ color: "white" }} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnterOtp;
