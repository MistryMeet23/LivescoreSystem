import React from 'react';
import { Container, Grid, Typography, Link, IconButton, Box } from '@mui/material';
import { Facebook, YouTube, Twitter, Instagram } from '@mui/icons-material';
import logo from '../assets/image/Logof.png';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#060c1f', color: '#fff', padding: '1rem 0' }}>
      <Container>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <Box mb={2}>
                <Box
                  component="img"
                  src={logo}
                  alt="BootstrapBrain Logo"
                  sx={{ width: { lg: '150%',xs:"40%",sm:"40%",xl:"150%",md:"80%" } , marginLeft:{xl:"-50%",lg:"-30%",md:"10%",xs:"30%"} }}
                />
            </Box>
          </Grid>

          <Grid item xs={12} md={4} lg={3} xl={2}>
            <Box>
              <Typography variant="h6" component="h4" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" component="address" gutterBottom>
                8014 Edith Blvd NE, Albuquerque, New York, United States
              </Typography>
              <Typography variant="body1" gutterBottom>
                <Link href="tel:+15057922430" color="secondary" underline="none">
                  (505) 792-2430
                </Link>
              </Typography>
              <Typography variant="body1">
                <Link href="mailto:demo@yourdomain.com" color="secondary" underline="none">
                  demo@yourdomain.com
                </Link>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} lg={3} xl={2}>
            <Box>
              <Typography variant="h6" component="h4" gutterBottom>
                Learn More
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', padding: 0 }}>
                {['About', 'Contact', 'Advertise', 'Terms of Service', 'Privacy Policy'].map((text, index) => (
                  <Box component="li" key={index} sx={{ marginBottom: index < 4 ? '0.5rem' : 0 }}>
                    <Link href="#!" color="secondary" underline="none">
                      {text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={3} xl={4}>
            <Box>
              <Typography variant="h6" component="h4" gutterBottom>
                Our Newsletter
              </Typography>
              <Typography variant="body1">
                Subscribe to our newsletter to get our news & discounts delivered to you.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="body2" align="center" sx={{ textAlign: { md: 'left' } }}>
              &copy; 2024. All Rights Reserved.
            </Typography>
            <Typography variant="body2" align="center" sx={{ textAlign: { md: 'left' }, color: 'text.secondary', marginTop: '0.5rem' }}>
              Built by{' '}
              <Link href="https://bootstrapbrain.com/" color="secondary" underline="none">
                LiveScore Team
              </Link>{' '}
              with <span style={{ color: '#007bff' }}>&#9829;</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container justifyContent="center" sx={{ justifyContent: { md: 'flex-end' } }}>
              {[{ icon: Facebook, link: '#!' }, { icon: YouTube, link: '#!' }, { icon: Twitter, link: '#!' }, { icon: Instagram, link: '#!' }].map((item, index) => (
                <IconButton key={index} component={Link} href={item.link} color="inherit">
                  <item.icon />
                </IconButton>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
