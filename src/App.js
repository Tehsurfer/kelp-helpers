import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapView from './MapView';
import Home from './Home';
import SponsorPage from './SponsorPage';
import ReefRescueGame from './ReefRescueGame';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { kelpGreen } from './colours';
import { TileProvider } from './TileContext';

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
      <TileProvider>
        <Router>
          <AppBar position="static" sx={{ bgcolor: kelpGreen }} className='app-bar'>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Kelp Helpers
              </Typography>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/map">Map</Button>
              <Button color="inherit" component={Link} to="/sponsor">Sponsor</Button>
              <Button color="inherit" component={Link} to="/reef-rescue">
                Play
              </Button>
            </Toolbar>
          </AppBar>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapViewWrapper />} />
              <Route path="/sponsor" element={<SponsorPage />} />
              <Route path="/reef-rescue" element={<ReefRescueGame />} />
            </Routes>
          </div>
        </Router>
      </TileProvider>
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
