import { useState } from 'react';
import './App.css';
import CitySelection from './components/CitySelection';
import WeatherList from './components/WeatherList';
import Container from 'react-bootstrap/Container';

function App() {
  const [city, setCity] = useState();
  return (
    <Container fluid="md" className="mt-3">
      <CitySelection setCity={setCity} />
      <WeatherList city={city} />
    </Container>

  );
}

export default App;
