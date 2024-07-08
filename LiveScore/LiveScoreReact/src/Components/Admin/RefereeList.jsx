import { Box, Chip, CircularProgress, Stack } from '@mui/material'
import HeaderFormat from '../Common/HeaderFormat'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../../ProtectedRoute';
import NoData from "./../Images/NoData.jpg"
import { GetReferee } from '../Apis/Admin';
import dayjs from 'dayjs';
import { Circle } from '@mui/icons-material';

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
      <Box sx={{ mt: 0 }}>No Referee Added</Box>
    </div>
  );
}


const RefereeList = () => {
  const [referee, setReferee] = useState([])
  const [loading, setLoading] = useState(true);
  const img_url = "http://localhost:5032/ACR/";

  const columns = useMemo(() => [
    {
      field: "imageURL", headerName: "Avatar", width: 80, headerClassName: "header", headerAlign: "center", align: "center",
      renderCell: (params) => (<img src={`${img_url}${params.value}`} alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />),
    },
    { field: "name", headerName: "Name", width: 130, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "email", headerName: "Email", width: 200, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "contact", headerName: "Contact", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "dateOfBirth", headerName: "DateOFBirth", width: 110, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : "------" },
    { field: "gender", headerName: "Gender", width: 80, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "age", headerName: "Age", width: 70, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "lastLogin", headerName: "LastLogin", width: 140, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY  HH:mm') : '------' },
    { field: "city", headerName: "City", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "state", headerName: "state", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "status", headerName: "Status", width: 100, headerClassName: "header", headerAlign: "center", align: "center" ,renderCell: params => {
        return <Chip icon={<Circle fontSize='small' color='success' />} label={params.row.status} color='success' variant='outlined' size='small' />
      } },
  ], [])

  const getReferee = async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await GetReferee();
      data && setReferee(data);
    } catch (error) {
      console.error('Error fetching referee data:', error);
    } finally {
      setLoading(false); // End loading
    }
  }

  useEffect(() => {
    getReferee()
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }} >
        <HeaderFormat title="Referee Management" />
      </Box>
      {loading ? <Box sx={{ display: "flex", justifyContent: "center" }} >
        <CircularProgress />
      </Box> :
        <Stack style={{
          marginTop: "1%",
          display: "grid",
          height: "60vh",
        }}>
          {referee && referee.length > 0 ? (
            <DataGrid
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
            />) : (<DataGrid
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
            />)
          }
        </Stack>
      }
    </Box>
  )
}
export default ProtectedRoute(RefereeList, 'admin')
