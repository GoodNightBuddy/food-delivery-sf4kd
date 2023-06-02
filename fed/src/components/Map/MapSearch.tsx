import React, { useRef, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const containerStyle = {
  width: '100%',
  aspectRatio: '16/9',
};

type Coordinates = {
  lat: number;
  lng: number;
};

type GoogleGeocodingResponse = {
  results: { geometry: { location: Coordinates } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

function MapSearch() {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<Coordinates>({ lat: 51.4982, lng: 31.28935 });

  const searchAddressHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredAddress = addressInputRef.current?.value;
    if (!enteredAddress) return;
    setIsLoading(true);

    axios
      .get<GoogleGeocodingResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          enteredAddress!
        )}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
      )
      .then(response => {
        if (response.data.status !== 'OK') {
          throw new Error('Could not fetch location!');
        }

        const coordinates = response.data.results[0].geometry.location;

        setCenter(coordinates);

        if (map) {
          map.panTo(coordinates);
          new google.maps.Marker({
            position: coordinates,
            map: map,
          });
        }
      })
      .catch(err => {
        alert(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  return (
    <Box>
      <form onSubmit={searchAddressHandler}>
        <FormControl>
          <FormLabel>Enter an address:</FormLabel>
          <Input type="text" ref={addressInputRef} />
        </FormControl>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Searching"
          mt={4}
        >
          Search
        </Button>
      </form>
      <Box id="map" borderRadius="xl" mt={4}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onLoad}

        >
          <Marker position={center} />
        </GoogleMap>
      </Box>
    </Box>
  );
}

export default MapSearch;
