import { Avatar, Box, Chip, CircularProgress, Fab, Stack } from '@mui/material'
import HeaderFormat from '../Common/HeaderFormat'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
// import { VerifyCoordinatorApi } from '../../Redux/Action/AdminAction';
import ProtectedRoute from '../../ProtectedRoute';
import dayjs from 'dayjs';
import { Block, Circle, VerifiedUser } from '@mui/icons-material';
import { toast } from 'react-toastify';
import NoData from "./../Images/NoData.jpg"
import { useState } from 'react';
import { GetCoordinator } from '../Apis/Admin';
import { VerifyCoordinatorApi } from '../../Redux/AdminRedux';


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
    </GridToolbarContainer>
  );
}

// For No Row Display
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
      <Box sx={{ mt: 0 }}>No Request Added</Box>
    </div>
  );
}


const VerifyCoordinator = () => {
  const [coordinator, setCoordinator] = useState()
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const { verifyData, error, blockdata, unblockdata } = useSelector(state => state.admin)

  const getCoordinator = async () => {
    setLoading(true)
    try {
      const { data } = await GetCoordinator()
      data && setCoordinator(data)
    } catch (error) {
      console.log("Some Error ", error)
    } finally {
      setLoading(false)
    }
  }


  const handleRequest = async (id) => {
    dispatch(VerifyCoordinatorApi(id))
    getCoordinator()
  }

  const img_url = "http://localhost:5032/ACR/";
  const columns = useMemo(() => [
    {
      field: "imageURL", headerName: "Avatar", width: 60, headerClassName: "header", headerAlign: "center", align: "center",
      renderCell: (params) => (<Avatar src={`${img_url}${params.value}`} />),
    },
    { field: "name", headerName: "Name", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "email", headerName: "Email", width: 230, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "contact", headerName: "Contact", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "dateOfBirth", headerName: "DateOFBirth", width: 120, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : "------" },
    { field: "gender", headerName: "Gender", width: 80, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "age", headerName: "Age", width: 40, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "city", headerName: "City", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "state", headerName: "state", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    {
      field: "status", headerName: "Status", width: 130, headerClassName: "header", headerAlign: "center", align: "center", renderCell: params => {
        if (params.row.status === "Not Verified") {
          return <Chip icon={<Circle fontSize='small' color='error' />} label={params.row.status} color='error' variant='outlined' size='small' />
        }
        else if (params.row.status === "Verified") {
          return <Chip icon={<Circle fontSize='small' color='success' />} label={params.row.status} color='success' variant='outlined' size='small' />
        }
        else if (params.row.status === "Block") {
          return <Chip icon={<Circle fontSize='small' color='warning' />} label={params.row.status} color='warning' variant='outlined' size='small' />
        }
      }
    }, {
      headerName: "Actions", headerClassName: "header", headerAlign: "center", align: "center",
      width: 122,
      renderCell: params => {
        if (params.row.status === "Not Verified") {
          return (
            <Fab variant="extended" size="small" color="success" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.id)}>
              <VerifiedUser size="small" sx={{ mr: 1 }} />
              Accept
            </Fab>)
        }
        else if (params.row.status === "Verified") {
          return (
            <Fab variant="extended" size="small" color="error" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.id)}>
              <Block size="small" sx={{ mr: 1 }} />
              Block
            </Fab>)
        }
        else if (params.row.status === "Block") {
          return (
            <Fab variant="extended" size="small" color="success" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.id)}>
              <Block size="small" sx={{ mr: 1 }} />
              Unblock
            </Fab>)
        }
      }
    }

  ])

  useEffect(() => {
    getCoordinator()
    if (verifyData) {
      toast.success(verifyData.msg)
      getCoordinator()
    }
    // if (blockdata) {
    //   toast.success(blockdata.msg)
    //   getCoordinator()
    // }
    // if (unblockdata) {
    //   toast.success(unblockdata.msg)
    //   getCoordinator()
    // }
    if (error) {
      toast.error(error.msg)
    }
  }, [verifyData, error,])

  return (
    <div>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }} >
          <HeaderFormat title="Coordinator Verifications" />
        </Box>
        {
          loading ? <CircularProgress /> :
            <Stack style={{
              marginTop: "1%",
              display: "grid",
              height: "60vh",
            }}>
              {coordinator && coordinator.length > 0 ? (
                <DataGrid
                  rows={coordinator}
                  columns={columns}
                  getRowId={(row) => row.id}
                  rowHeight={53}
                  rowSelection="true"
                  rowSpacingType='margin'
                  slots={{ toolbar: CustomToolbar }}
                  scrollbarSize={1}
                  columnHeaderHeight={37}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />) : (<DataGrid
                  autoHeight
                  rows={[]}
                  columns={columns}
                  getRowId={(row) => row.id}
                  rowHeight={53}
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
    </div>
  )
}
export default ProtectedRoute(VerifyCoordinator, 'admin')
