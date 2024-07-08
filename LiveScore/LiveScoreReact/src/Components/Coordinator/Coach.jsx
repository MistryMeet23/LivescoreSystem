import { Avatar, Box, CircularProgress, Fab,  Stack, Tooltip } from '@mui/material'
import HeaderFormat from '../Common/HeaderFormat'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import NoData from "./../Images/NoData.jpg"
import ProtectedRoute from '../../ProtectedRoute';
import { toast } from 'react-toastify';
import AddCoach from './AddCoach';
import { Block, DriveFileRenameOutlineRounded, VerifiedUser } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GetCoach } from '../Apis/Coordinator';
import { BlockCoachApi, clearMessage } from '../../Redux/CoordinatorRedux';


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <AddCoach />
    </GridToolbarContainer>
  );
}

function CustomNoRowsOverlay() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      <img
        style={{ flexShrink: 0, marginTop: "15%" }}
        src={NoData}
        alt="No Rows"
        width="240"
        height="240"

      />
      <Box sx={{ mt: 0 }}>No Coach Added</Box>
    </div>
  );
}
const Coach = () => {

  const [coach, setCoach] = useState()
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const {  data, error } = useSelector(state => state.coordinator)


  const handleRequest = async (id) => {
    dispatch(BlockCoachApi(id))
    getCoach()
  }

  const columns = useMemo(() => [
    {
      field: `imageUrl`, headerName: "Avatar", width: 60, headerClassName: "header", headerAlign: "center", align: "center",
      renderCell: (params) => (
        <Link to={`/coordinator/editCoachPic/${params.row.coachId}`}> <Avatar src={`/coach/${params.value}`} alt="Avatar" /></Link>
      ),
    },
    { field: "coachName", headerName: "Name", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "coachEmail", headerName: "Email", width: 200, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "contactNo", headerName: "Contact", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "gender", headerName: "Gender", width: 90, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "experience", headerName: "Experience", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "achievements", headerName: "Achievements", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    {
      headerName: "Actions", headerClassName: "header", headerAlign: "center", align: "center",
      width: 180,
      renderCell: params => {
        if (params.row.status === "UnBlock") {
          return (
            <Box sx={{ p: 1 }}>
              <Tooltip title="Edit">
                <Link to={`/coordinator/editCoach/${params.row.coachId}`} >
                  <Fab variant="extended" size="small" color="warning" sx={{ fontSize: '0.75rem', mr: 1 }}>
                    <DriveFileRenameOutlineRounded size="small" sx={{ mr: 1 }} />Edit
                  </Fab>
                </Link>
              </Tooltip>
              <Fab variant="extended" size="small" color="error" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.coachId)}>
                <VerifiedUser size="small" sx={{ mr: 1 }} />
                Block
              </Fab>
            </Box>
          )
        }
        else if (params.row.status === "Block") {
          return (
            <Fab variant="extended" size="small" color="success" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.coachId)}>
              <Block size="small" sx={{ mr: 1 }} />
              Unblock
            </Fab>)
        }
      }
    }

  ], [])

  const getCoach = async () => {
    setLoading(true)
    try {
    const {data} = await GetCoach()
    data && setCoach(data)
  }
     catch (error) {
      console.log("Something Went Wrong", error)
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    getCoach() 
    if (data) {
      toast.success(data.msg)
      dispatch((clearMessage()))
    }
    if (error) {
      toast.error(error.msg)
      dispatch((clearMessage()))
    }
  }, [data, error])


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }} >
        <HeaderFormat title="Coach Management" />
      </Box>
      {
        loading ? <CircularProgress /> :
          <Stack style={{
            marginTop: "1%",
            display: "grid",
            height: "70vh",

          }}>{

              coach && coach.length > 0 ? (
                <DataGrid
                  rows={coach}
                  columns={columns}
                  getRowId={(row) => row.coachId}
                  // rowHeight={53}
                  rowSelection={true}
                  rowSpacingType='margin'
                  slots={{ toolbar: CustomToolbar }}
                  scrollbarSize={1}
                  columnHeaderHeight={37}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />) : (

                <DataGrid
                  autoHeight
                  rows={[]}
                  columns={columns}
                  getRowId={(row) => row.id}
                  rowHeight={42}
                  rowSelection="true"
                  rowSpacingType='margin'
                  slots={{ toolbar: CustomToolbar, noRowsOverlay: CustomNoRowsOverlay }}
                  scrollbarSize={1}
                  columnHeaderHeight={37}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              )
            }
          </Stack>
      }

    </Box>
  )
}

export default ProtectedRoute(Coach, 'coordinator') 
