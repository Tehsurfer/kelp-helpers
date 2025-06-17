import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapView from './MapView';
import Home from './Home';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { kelpGreen } from './colours';

const theme = createTheme({
  palette: {
    primary: {
      main: kelpGreen,
    },
    secondary: {
      main: '#1976d2', // or any color you want for secondary
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" sx={{ bgcolor: kelpGreen }} className='app-bar'>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Kelp Helpers
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/map">Map</Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapViewWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Wrapper to provide required props to MapView
function MapViewWrapper() {
  const [popupInfo, setPopupInfo] = React.useState(null);
  const [selectedTileId, setSelectedTileId] = React.useState(null);
  return (
    <MapView
      popupInfo={popupInfo}
      setPopupInfo={setPopupInfo}
      selectedTileId={selectedTileId}
      setSelectedTileId={setSelectedTileId}
    />
  );
}

export default App;
