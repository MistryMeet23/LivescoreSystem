import AddReferee from "./AddReferee"
import { Avatar, Box, Chip, CircularProgress, Fab, Stack } from '@mui/material'
import HeaderFormat from '../Common/HeaderFormat'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import NoData from "./../Images/NoData.jpg"
import { Block, Circle, VerifiedUser } from "@mui/icons-material";
import { useState } from "react";
import { GetReferee } from "../Apis/Coordinator";
import { toast } from "react-toastify";
import { BlockRefereeApi, clearMessage } from "../../Redux/CoordinatorRedux";
import dayjs from "dayjs";
import ProtectedRoute from "../../ProtectedRoute";


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
      <AddReferee />
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
      <Box sx={{ mt: 0 }}>No Referee Added</Box>
    </div>
  );
}

const Referee = () => {

const dispatch = useDispatch()
const [referee, setReferee] = useState([])
const [loading, setLoading] = useState(false)
const {data, error} = useSelector(state => state.coordinator)

 const handleRequest =  (id) => {
     dispatch(BlockRefereeApi(id))
    getRef()
  }
  

  const columns = useMemo(() => [
    { field: "imageURL", headerName: "Avatar", width: 80, headerClassName: "header", headerAlign: "center", align: "center",
     renderCell: (params) => (
      <Avatar src={`/ACR/${params.value}`} alt="Avatar" />
      ), },
    { field: "name", headerName: "Name", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "email", headerName: "Email", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "contact", headerName: "Contact", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "dateOfBirth", headerName: "DateOFBirth", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "gender", headerName: "Gender", width: 90, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "age", headerName: "Age", width: 70, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "lastLogin", headerName: "LastLogin", width: 150, headerClassName: "header", headerAlign: "center", align: "center",valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY  HH:mm') : '------' },
    { field: "city", headerName: "City", width: 80, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "state", headerName: "State", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    // { field: "status", headerName: "Status", width: 90, headerClassName: "header", headerAlign: "center", align: "center" },
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
    },
    //  {
    //   headerName: "Actions", headerClassName: "header", headerAlign: "center", align: "center",
    //   width: 122,
    //   renderCell: params => {
    //     if (params.row.status === "Not Verified") {
    //       return (
    //         <Fab variant="extended" size="small" color="success" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.id)}>
    //           <VerifiedUser size="small" sx={{ mr: 1 }} />
    //           Accept
    //         </Fab>)
    //     }
    //     else if (params.row.status === "Verified") {
    //       return (
    //         <Fab variant="extended" size="small" color="error" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.id)}>
    //           <Block size="small" sx={{ mr: 1 }} />
    //           Block
    //         </Fab>)
    //     }
    //     else if (params.row.status === "Block") {
    //       return (
    //         <Fab variant="extended" size="small" color="success" sx={{ fontSize: '0.75rem' }} onClick={() => handleRequest(params.row.id)}>
    //           <Block size="small" sx={{ mr: 1 }} />
    //           Unblock
    //         </Fab>)
    //     }
    //   }
    // }
  ], [])

  const getRef = async () => {
    setLoading(true)
    try {
    const {data} = await GetReferee()
    data && setReferee(data)} catch (error) {
      console.log("Something Went Wrong", error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getRef()
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
    <div>
       <Box>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }} >
        <HeaderFormat title="Referee Management" />
      </Box>
      {
      loading ? <CircularProgress /> :
      <Stack style={{
        marginTop: "1%",
        display: "grid",
        // width: "100%",
        height: "70vh",

      }}>
        {referee && referee.length > 0 ? (
          <DataGrid
          autoHeight
            rows={referee}
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
      
    </div>
  )
}

export default ProtectedRoute(Referee,"coordinator")
