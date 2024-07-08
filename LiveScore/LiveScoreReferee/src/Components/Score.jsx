import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, List, ListItem, ListItemText, Divider, Grid } from '@mui/material';

const Score = () => {
  return (
    <Card sx={{ maxWidth: 345, mx: 3, p: 2, borderColor: "grey", borderRadius: "7px", color: "white", backgroundColor: "#141c33", border: '1px' }}>
      <CardContent>
        <Typography variant="h5" component="div" fontWeight="bold">
          Match
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mt={2} mb={0}>
          <Typography variant="body2" sx={{ mx: 2 }}>
            Player1
          </Typography>
          <Typography variant="body2" sx={{ mx: 2 }}>
            Player2
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" gap={0} mt={2} >
          <CardMedia
            component="img"
            image="https://media.istockphoto.com/id/1454026690/photo/portrait-of-female-volleyball-player-holding-a-volleyball-ball-at-sports-court.jpg?s=2048x2048&w=is&k=20&c=TrbS88KkqWUjGFdHpyhgHh1e6h0gIoZlJozquRlQgCU="
            alt="Live"
            sx={{ height: '10vh', clipPath: 'circle()', m: 1 }}
          />
          <Typography variant="h4" component="div" sx={{ mx: 0 }}>
            V/S
          </Typography>
          <CardMedia
            component="img"
            image="https://media.istockphoto.com/id/1454026690/photo/portrait-of-female-volleyball-player-holding-a-volleyball-ball-at-sports-court.jpg?s=2048x2048&w=is&k=20&c=TrbS88KkqWUjGFdHpyhgHh1e6h0gIoZlJozquRlQgCU="
            alt="Live"
            sx={{ height: '10vh', clipPath: 'circle()', m: 1 }}
          />
        </Box>
      </CardContent>
      <Typography variant="h6" component="div" fontWeight="bold" sx={{ mx: 1 }}>
        Player 1
      </Typography>
      <List>
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>Rounds</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Score</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Penalty</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Final</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider sx={{ backgroundColor: "white" }} />
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>R1</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>10</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>2</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Win</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>R2</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>10</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>2</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Lose</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>R3</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>--</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>--</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>--</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
      </List>
      <Typography variant="h6" component="div" fontWeight="bold" sx={{ mx: 1 }}>
        Player 2
      </Typography>
      <List>
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>Rounds</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Score</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Penalty</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Final</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider sx={{ backgroundColor: "white" }} />
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>R1</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>10</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>2</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Win</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>R2</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>10</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>2</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>Lose</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container spacing={2}>
            <Grid item xs={3} textAlign="center">
              <Typography>R3</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>--</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>--</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography>--</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
      </List>
    </Card>
  );
}

export default Score;
