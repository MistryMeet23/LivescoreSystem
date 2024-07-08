import { Avatar, Box, CircularProgress,  FormControl, InputLabel, MenuItem, Select, Stack, Tooltip, IconButton } from "@mui/material"
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import NoData from "./../Images/NoData.jpg"
import HeaderFormat from "../Common/HeaderFormat";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { Visibility } from "@mui/icons-material";
import { useState } from "react";
import { GetMatch } from "../Apis/Coordinator";
import { clearMessage } from "../../Redux/CoordinatorRedux";
import { Link } from "react-router-dom";
import { GetMatchHistory } from "../Apis/Common";
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
      <Box sx={{ mt: 0 }}>No Match Added</Box>
    </div>
  );
}

const MatchDetails = () => {
 const img_url = "http://localhost:5032/images/";
  const [status, setStatus] = useState(1)
  const [match, setMatch] = useState()
  const [matchHistory, setMatchHistory] = useState()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const { data, error } = useSelector(state => state.admin)


  const getMatch = async () => {
    setLoading(true)
    try {
      const { data } = await GetMatch()
      data && setMatch(data)
    }
    catch (e) {
      console.log("Something Went Wrong.", e);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMatch()
    if (data) {
      toast.success(data.msg)
      dispatch((clearMessage()))
    }
    if (error) {
      toast.error(error.msg)
      dispatch((clearMessage()))
    }
  }, [data, error])

  
  const getMatchHistory = async () => {
    setLoading(true)
    try {
      const { data } = await GetMatchHistory()
      data && setMatchHistory(data)
    }
    catch (e) {
      console.log("Something Went Wrong.", e);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMatchHistory()
    if (data) {
      toast.success(data.msg)
      dispatch((clearMessage()))
    }
    if (error) {
      toast.error(error.msg)
      dispatch((clearMessage()))
    }
  }, [data, error])

  useEffect(() => {
    getMatch()
    getMatchHistory()
  }, [])

  useEffect(() => {
    if (data) {
      toast.success(data.msg)
      dispatch(clearMessage())
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(data.msg)
      dispatch(clearMessage())
    }
  }, [error])

  const handleChange = (status) => {
        setStatus(status)
    }



  const columns = useMemo(() => [
    { field: "matchGroup", headerName: "GId", width: 30, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "tournament", headerName: "Tournament", width: 145, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "matchType", headerName: "Match Type", width: 130, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "matchStatus", headerName: "Match Status", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "matchDate", headerName: "Match Date", width: 100, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : "------" },
    { field: "category", headerName: "Category", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "gender", headerName: "Gender", width: 70, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "athleteRed", headerName: "Athlete Red", width: 110, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "athleteBlue", headerName: "Athlete Blue", width: 110, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "matchCoordinator", headerName: "Coordinator", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.matchCoordinator ? params.row.matchCoordinator : '------', 
    },
    { field: "referee1", headerName: "Referee 1", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.referee1 ? params.row.referee1 : '------',
    },
    { field: "referee2", headerName: "Referee 2", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.referee2 ? params.row.referee2 : '------',
    },
    { field: "referee3", headerName: "Referee 3", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.referee3 ? params.row.referee3 : '------',
     },
  ], [])
  const columnsHistory = useMemo(() => [
    {
      headerName: "Rounds", width: 63, headerClassName: "header", headerAlign: "center", align: "center", renderCell: params => {
        return (
          <Box>
            <Tooltip title="RoundsDetails">
              <Link to={`/admin/roundscores/${params.row.mid}`} >
                <IconButton>
                  <Visibility color="primary" />
                </IconButton>
                </Link>
            </Tooltip>            
          </Box>
        )
      }
    },
    { field: "matchGroup", headerName: "GId", width: 30, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "nextMatchId", headerName: "NextId", width: 60, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "flag", headerName: "Winner", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
     {
      field: "athleteRedImg", headerName: "RedImage", width: 80, headerClassName: "header", headerAlign: "center", align: "center",
      renderCell: (params) => (
       <Avatar src={`${img_url}${params.value}`} alt="Avatar" />
      ),
    },
    { field: "athleteRed", headerName: "Athlete Red", width: 110, headerClassName: "header", headerAlign: "center", align: "center", },
    {
      field: "athleteBlueImg", headerName: "BlueImage", width: 83, headerClassName: "header", headerAlign: "center", align: "center",
      renderCell: (params) => (
       <Avatar src={`${img_url}${params.value}`} alt="Avatar" />
      ),
    },
     { field: "athleteBlue", headerName: "Athlete Blue", width: 110, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "tournament", headerName: "Tournament", width: 145, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "matchType", headerName: "Match Type", width: 130, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "matchDate", headerName: "Match Date", width: 101, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : "------" },
    { field: "category", headerName: "Category", width: 100, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "gender", headerName: "Gender", width: 70, headerClassName: "header", headerAlign: "center", align: "center" }, 
  
    { field: "matchCoordinator", headerName: "Coordinator", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.matchCoordinator ? params.row.matchCoordinator : '------', 
    },
    { field: "referee1", headerName: "Referee 1", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.referee1 ? params.row.referee1 : '------',
    },
    { field: "referee2", headerName: "Referee 2", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.referee2 ? params.row.referee2 : '------',
    },
    { field: "referee3", headerName: "Referee 3", width: 100, headerClassName: "header", headerAlign: "center", align: "center",
      valueGetter: (params) => params.row.referee3 ? params.row.referee3 : '------',
     },

  ], [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }} >
        <HeaderFormat title="Match Management" />
          <Box display='flex' justifyContent='flex-end' alignItems='center' >
            <FormControl sx={{ m: 1, minWidth: 150, }} size="small">
                <InputLabel id="demo-select-small-label"></InputLabel>
                <Select
                    size='small'
                    sx={{ borderRadius: "15px" }}
                    color='secondary'
                    variant='outlined'
                    defaultValue={1}
                    onChange={(e) => { handleChange(e.target.value) }}
                >
                    <MenuItem value={1}>Match</MenuItem>
                    <MenuItem value={2}>History</MenuItem>
                </Select>
            </FormControl>
            </Box>
          </Box>
          {
            loading ? <CircularProgress /> :
            status === 1 &&
              <Stack style={{
                marginTop: "1%",
                display: "grid",
                height: "78vh",
              }}>
                {match && match.length > 0 ? (
                  <DataGrid
                    rows={match}
                    columns={columns}
                    getRowId={(row) => row.mid}
                    rowHeight={54}
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
          {
            status === 2 &&
              <Stack style={{
                marginTop: "1%",
                display: "grid",
                height: "78vh",
              }}>
                {matchHistory && matchHistory.length > 0 ? (
                  <DataGrid
                    rows={matchHistory}
                    columns={columnsHistory}
                    getRowId={(row) => row.mid}
                    rowHeight={54}
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
  )
}

export default ProtectedRoute(MatchDetails, 'admin')
