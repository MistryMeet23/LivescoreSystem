import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RoundPostApi, clearMessage } from '../../Redux/CoordinatorRedux';
import { useFormik } from 'formik';
import { RoundValidate } from '../Validation/Coordinator';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../ProtectedRoute';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};


const AddRound = () => {
   const { matchGroup, mid } = useParams()
   const { data, error } = useSelector(state => state.coordinator)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleClose = () => {
    // setOpen(false);
  };

  useEffect(() => {
    if (data && data.msg) {
      toast.success(data.msg)
      dispatch(clearMessage())
      navigate(`/coordinator/scoring/${matchGroup}/${values.rounds}`)
    }
    if (error) {
      toast.error(error.msg)
      dispatch(clearMessage())
    }
  }, [data, error, navigate, dispatch])
  const initial = {
    rounds: ""
  }

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initial,
    validationSchema: RoundValidate,
    onSubmit: async (values, {  setSubmitting }) => {
      try {
        // console.log(mid)
        dispatch(RoundPostApi({ values, mid }))
        setSubmitting(false)
        // resetForm({ values: "" });

      } catch (error) {
        <CircularProgress />
      }
    },
  })

  return (
    <React.Fragment>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ ...style }}>
            <Typography variant="h5" color="initial">Select Round</Typography>
            <FormControl sx={{ mt: "5" }} fullWidth>
              <InputLabel id="demo-simple-select-label">Select Rounds</InputLabel>
              <Select
                id="rounds"
                name="rounds"
                label="Round"
                color="secondary"
                variant="filled"
                value={values.rounds}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
            {errors.rounds && touched.rounds ? (<Typography variant="subtitle1" color="error">{errors.rounds}</Typography>) : null}
            <Box sx={{ marginTop: "3%", display: "flex", justifyContent: 'end', alignContent: "center" }}>
              <Button type='submit'>Start Round</Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </React.Fragment>
  )
}

export default ProtectedRoute(AddRound,"coordinator")