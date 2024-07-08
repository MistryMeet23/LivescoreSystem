import  { useState, useEffect, useMemo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box,  CircularProgress, Dialog, DialogContent, DialogTitle, Fab, IconButton, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, } from '@mui/x-data-grid';
import { GetRoundsByMatchId, GetScoresandRounds } from '../Apis/Common';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearMessage } from '../../Redux/CoordinatorRedux';
import dayjs from 'dayjs';
import { EmojiEvents, SportsGymnasticsRounded } from '@mui/icons-material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50%'
    }}>
      <Typography>No Score Added</Typography>
    </div>
  );
}

const RoundScores = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null); // Track the index of the currently expanded accordion
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState([]);
  const [scoreData, setScoreData] = useState([])
  const { mid } = useParams();
  const dispatch = useDispatch();
  const { data, error } = useSelector(state => state.coordinator);

  useEffect(() => {
    const fetchMatchAndRounds = async () => {
      try {
        const roundsResponse = await GetRoundsByMatchId(mid);
        const matchRounds = roundsResponse.data;
        setMatch(matchRounds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching match and rounds:", error);
      }
    };
    fetchMatchAndRounds();
  }, [mid]);

  useEffect(() => {
    if (data) {
      toast.success(data.msg);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error.msg);
      dispatch(clearMessage());
    }
  }, [data, error, dispatch]);

  const getScoresandRounds = async (roundId, index) => {
    setLoading(true);
    try {
      const { data } = await GetScoresandRounds(mid, roundId);
      setExpandedIndex(index); // Set the index of the currently expanded accordion
      setScoreData(data)
    } catch (error) {
      console.error("Error fetching scores and rounds:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/admin/matchdetails");
  };

  const columns = useMemo(() => [
    { field: "redPoints", headerName: "RedPoints", width: 110, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "bluePoints", headerName: "BluePoints", width: 110, headerClassName: "header", headerAlign: "center", align: "center", },
    { field: "redPanelty", headerName: "RedPanelty", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "bluePanelty", headerName: "BluePenalty", width: 110, headerClassName: "header", headerAlign: "center", align: "center" },
    { field: "scoreTime", headerName: "ScoreTime", width: 200, headerClassName: "header", headerAlign: "center", align: "center", valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY  HH:mm:ss') : '------'  },
  
  ], []);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} fullWidth maxWidth="md" aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Rounds</DialogTitle>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              match.map((round, index) => (
                <Accordion
                  key={index}
                  expanded={expandedIndex === index} // Only open the accordion if its index matches the expandedIndex
                  onChange={() => getScoresandRounds(round.rounds, index)}
                  sx={{
                    '& .MuiAccordionDetails-root': {
                      display: expandedIndex === index ? 'block' : 'none', // Show the details only if it's the currently expanded accordion
                    },
                  }}

                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`round-${index}-content`} id={`round-${index}-header`}>
                    <Typography>{`Round ${index + 1}`}</Typography>
                    
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{display:'flex', justifyContent:'space-between' ,mb:'1%' }} >
                      <Fab variant="extended" size='small' color='warning'>
                      <EmojiEvents /> &nbsp; Round Winner : {round.roundWinner} &nbsp;
                    </Fab>
                      <Fab variant="extended" size='small' color='error'>
                      <SportsGymnasticsRounded /> &nbsp; Red Total Score : {round.redTotalScore} &nbsp;
                    </Fab>
                      <Fab variant="extended" size='small' color='primary'>
                     <SportsGymnasticsRounded  /> &nbsp; Blue Total Score : {round.blueTotalScore} &nbsp;
                    </Fab>
                     </Box>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        {scoreData && scoreData.length > 0 ? (
                          <Box>
                          <Typography variant="h1" color="error">{scoreData.roundWinner}</Typography>
                          
                          <DataGrid
                            rows={scoreData}
                            columns={columns}
                            getRowId={(row) => row.sid}
                            rowHeight={54}
                            rowSelection="true"
                            rowSpacingType='margin'
                            scrollbarSize={1}
                            columnHeaderHeight={37}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                          />
                          </Box>
                        ) : (
                          <CustomNoRowsOverlay /> 
                        )}
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};


export default RoundScores