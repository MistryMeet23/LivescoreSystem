import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogoutRounded, MenuRounded } from '@mui/icons-material';
import logo from "../Images/Logof.png"


const drawerWidth = 260;

const Header = ({ link, icons, sidebarRoute, name, sideRouterName, sideRouteIcon, sideRouteLink }) => {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const img = localStorage.getItem("Img");

    // for logout
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('role')
        navigate("/")
    }

    // for user menu open
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // for close user menu
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // for sidebar close
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };


    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    // for toggling the sidebar
    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            {/* <Typography variant="h3" style={{
                fontSize: "2.7rem",
                // fontFamily:"monospace"
            }} color="initial">Live Score</Typography> */}
            <img src={logo} alt="Live Score" style={{ width: "15vw", height: "15vh", marginRight: "5px" }} />
            {/* <Toolbar /> */}
            {/* <Divider /> */}
            <List sx={{}}>
                {sidebarRoute?.map((text, index) => (
                    <ListItem key={text} disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            component={Link}
                            to={`/${link}/${text}`}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: theme.palette.primary.light,
                                    minWidth: 0,
                                    mr: open ? 2 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                {React.createElement(icons[index % icons.length])}
                            </ListItemIcon>
                            <ListItemText primary={name[index]} sx={{ opacity: open ? 1 : 0, fontSize: "1rem" }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {/* <Divider /> */}

        </div>
    );


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'transparent',
                    fontFamily: "monospace",
                    color: theme.palette.primary.main
                }}

            >
                <Toolbar>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuRounded />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {/* Responsive drawer */}
                        </Typography>

                        {/* profile  */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    {/* <People/> */}
                                    <Avatar alt="Bhagyashree" sx={{ bgcolor: "seagreen" }} src={`/ACR/${img}`} >A</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px', maxWidth: "15%" }}
                                id="menu-AppBar"
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
                                {sideRouteLink?.map((text, index) => (
                                    <MenuItem key={text} sx={{ maxHeight: "2%" }} >
                                        <ListItemButton
                                            component={Link}
                                            to={`/${link}/${text}`}
                                            sx={{
                                                maxHeight: 20,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    color: theme.palette.primary.light,
                                                    minWidth: 0,
                                                    mr: 1,
                                                    justifyContent: "center",
                                                }}>
                                                {React.createElement(sideRouteIcon[index % sideRouteIcon.length])}
                                            </ListItemIcon>
                                            <ListItemText primary={sideRouterName[index]} sx={{ opacity: open ? 1 : 0, fontSize: "2rem" }} />
                                        </ListItemButton>
                                    </MenuItem>

                                ))}
                                <MenuItem onClick={handleLogout} sx={{ maxHeight: "2%" }}  >
                                    <ListItemButton
                                        sx={{
                                            maxHeight: 20,
                                        }}>

                                        <ListItemIcon sx={{
                                            color: theme.palette.primary.light,
                                            minWidth: 0,
                                            mr: 1,
                                            justifyContent: "center"
                                        }}>
                                            <LogoutRounded />
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, fontSize: "2rem" }} />
                                    </ListItemButton>
                                </MenuItem>
                            </Menu>
                        </Box>

                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >

                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    //   container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >

                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box >
    );
}

Header.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};

export default Header;
