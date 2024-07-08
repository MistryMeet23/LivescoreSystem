import { AddPhotoAlternateRounded, Close } from '@mui/icons-material'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
// import { AtheletePutPicApi } from '../../Redux/Action/CoordinatorAction'
import { toast } from 'react-toastify'
import { GetAthleteById } from '../Apis/Coordinator'
import { AthletePutPicApi, clearMessage } from '../../Redux/CoordinatorRedux'
import ProtectedRoute from '../../ProtectedRoute'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditAtheleteProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [image, setImage] = useState({
    imageUrl:""
  });
  const [selectedFile, setSelectedFile] = React.useState()
  const navigate = useNavigate()


  const getAthleteById = async () => {
    try {
      const { data } = await GetAthleteById(id);
      data && setImage(data)
    } catch (error) {
      console.error("Error fetching athlete data:", error);
    }
  }
  useEffect(() => {
    getAthleteById()
  }, [id])


  const handleClose = () => {
    navigate("/coordinator/athlete")
  };


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
      formData.append("ImageFile", selectedFile);
      dispatch(AthletePutPicApi({ values: formData, id }))
      navigate("/coordinator/athlete")
      dispatch(clearMessage())

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
      <DialogTitle>Update Athlete Picture</DialogTitle>
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
          src={image.imageUrl ? `/images/${image.imageUrl}` : ""}
          sx={{
            height: "12rem",
            width: "12rem",
            margin: "auto",
            boxShadow: "3px 3px 6px"
          }}
          alt='hello' />
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

export default ProtectedRoute(EditAtheleteProfile,"coordinator")