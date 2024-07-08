import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { AddPhotoAlternateRounded, Close } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { GetCoachById } from '../Apis/Coordinator'
import { CoachPutPicApi, clearMessage } from '../../Redux/CoordinatorRedux'
import ProtectedRoute from '../../ProtectedRoute'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const EditCoachPic = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [image, setImage] = React.useState();
  const [selectedFile, setSelectedFile] = React.useState()
  const navigate = useNavigate()
  const { data, error } = useSelector(state => state.coordinator)

  const getCoach = async () => {
    const { data } = await GetCoachById(id)
    data && setImage(data)
  }
  useEffect(() => {
    getCoach()
  }, [])

  const handleClose = () => {
    navigate("/coordinator/coach")
  };
  useEffect(() => {
    if (data && data.msg) {
      toast.success(data.msg)
      dispatch(clearMessage())
      navigate("/coordinator/coach")
    }
    if (error) {
      toast.error(error.msg)
      dispatch(clearMessage())
    }
  }, [data, error, navigate, dispatch])



  const handleImage = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file)

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateImage = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("ImageFile", selectedFile)
      dispatch(CoachPutPicApi({ id, values: formData }))


    } else {
      toast.error("Please First Select Image...")
    }
  }
  return (
    <Dialog
      open="true"
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Update Coach Picture</DialogTitle>
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
      <DialogContent>
        <Avatar
          src={image ? `/coach/${image.imageUrl}` : ""}
          sx={{
            height: "12rem",
            width: "12rem",
            margin: "auto",
            boxShadow: "3px 3px 6px"
          }} />
        <TextField
          // sx={{ margin: "2rem 0 ", }}
          id="name"
          onChange={handleImage}
          sx={{ margin: "1rem 0 " }}
          type="file"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ display: "block" }}
          fullWidth
          onClick={handleUpdateImage}
          startIcon={<AddPhotoAlternateRounded />}>
          Update Image
        </Button>

      </DialogContent>
    </Dialog>
  )
}

export default ProtectedRoute(EditCoachPic, "coordinator")