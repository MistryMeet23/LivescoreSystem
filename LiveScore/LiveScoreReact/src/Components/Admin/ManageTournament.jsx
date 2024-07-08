import { Box, CircularProgress, Fab, Stack, Tooltip, } from '@mui/material';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import HeaderFormat from '../Common/HeaderFormat';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import AddTournament from './AddTournament';
import ProtectedRoute from '../../ProtectedRoute';
import NoData from "./../Images/NoData.jpg"
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { GetTournament } from '../Apis/Admin';
import { clearMessageAdmin } from '../../Redux/AdminRedux';
import { Link } from 'react-router-dom';
import { DriveFileRenameOutlineRounded } from '@mui/icons-material';

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
      <AddTournament />
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


const ManageTournament = () => {

  const [tournament, setTournament] = useState()
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const { data, error } = useSelector(state => state.admin)
  const columns = useMemo(() => [
    { field: "tournamentName", headerName: "Tournament Name", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "venue", headerName: "Venue", width: 150, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "tournamentDate", headerName: "Date", width: 110, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : "------" },
    {
      field: "tournamentCoordinator", headerName: "Coordinator", width: 110, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.tournamentCoordinator ? params.row.tournamentCoordinator : '------',
    },
    {
      headerName: "Actions", headerClassName: "header", headerAlign: "center", align: "center", width: 122,
      renderCell: params => {
        return (
          <Box>
            <Tooltip title="Edit">
              <Link to={`/admin/edittournament/${params.row.tId}`} >
                <Fab variant="extended" size="small" color="warning" sx={{ fontSize: '0.75rem', mr: 1 }}>
                  <DriveFileRenameOutlineRounded size="small" sx={{ mr: 1 }} /> Edit
                </Fab>
              </Link>
            </Tooltip>
          </Box>
        )
      }

    }
  ])

  const getTournament = async () => {
    setLoading(true)
    try {
      const { data } = await GetTournament()
      data && setTournament(data)
    } catch (error) {
      console.log("Something Went Wrong", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTournament()
    if (data) {
      toast.success(data.msg)
      getTournament()
      dispatch(clearMessageAdmin())
    }
    if (error) {
      toast.error(error.msg)
      dispatch(clearMessageAdmin())
    }
  }, [data, error])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }} >
        <HeaderFormat title="Tournament Management" />
      </Box>
      {loading ? <Box sx={{ display: "flex", justifyContent: "center" }} >
        <CircularProgress />
      </Box> :
        <Stack style={{
          marginTop: "1%",
          display: "grid",
          height: "50vh",
        }}>
          {tournament && tournament.length > 0 ? (
            <DataGrid
              rows={tournament}
              columns={columns}
              getRowId={(row) => row.tId}
              rowHeight={42}
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
          )}
        </Stack>
      }
    </Box>
  )
}

export default ProtectedRoute(ManageTournament, 'admin')
