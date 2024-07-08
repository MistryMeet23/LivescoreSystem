import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../assets/image/Logof.png';
import { Link, useNavigate } from 'react-router-dom';



const Index = () => {

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const img = localStorage.getItem("Img");

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

   // for logout
   const navigate = useNavigate()
   const handleLogout = () => {
       localStorage.removeItem('ID')
       navigate("/")
   }


  return (
    <AppBar position="static" sx={{ backgroundColor: '#060c1f' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={logo}
            alt="Live Score"
            sx={{
              display: { xs: 'flex', md: 'flex' },
              width: {lg:'12vw',sm:"10vw",xs:"30vw",md:"20vw"},
              height: {lg:'12vh',sm:"12vh",xs:"10vh",md:"20vh"},
              // height: '12vh',
              marginRight: 2,
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
           
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
           
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ width: 56, height: 56 }} alt="Remy Sharp" src={`/ACR/${img}`} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ 
                mt: '45px',
                '& .MuiPaper-root': {
                  backgroundColor: '#141c33',
                  color:"white"
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem   component={Link} to="/Profile">
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem   onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
             
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Index;
