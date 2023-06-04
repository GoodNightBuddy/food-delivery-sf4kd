import React, { useRef, useState, useEffect } from 'react';
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { IShop, useAppSelector } from '../../store/types/types';

const containerStyle = {
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: '0.375rem',
};

type Libraries = Array<
  'places' | 'drawing' | 'geometry' | 'localContext' | 'visualization'
>;

function MapSearch() {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shop, setShop] = useState<IShop | null>(null);
  const [libraries] = useState<Libraries>(['places']);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
    libraries,
  });

  const shops = useAppSelector(state => state.shop.shops);
  const currentShopId = useAppSelector(state => state.shop.currentShopId);

  useEffect(() => {
    if (shops.length && currentShopId) {
      const currentShop = shops.find(shop => shop.id === currentShopId);
      if (currentShop) {
        setShop(currentShop);
      }
    }
  }, [currentShopId, shops]);

  async function calculateRoute(origin: string, destination: string) {
    if (!origin || !destination) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirections(results);

    if (results.routes[0].legs[0].distance?.text) {
      setDistance(results.routes[0].legs[0].distance?.text);
    }

    if (results.routes[0].legs[0].duration?.text) {
      setDuration(results.routes[0].legs[0].duration.text);
    }
  }

  const searchAddressHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredAddress = addressInputRef.current?.value;
    if (!enteredAddress || !map || !shop) return;
    setIsLoading(true);
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: enteredAddress }, function (results, status) {
      if (status === 'OK' && results) {
        calculateRoute(shop.address, enteredAddress);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }

      setIsLoading(false);
    });
  };

  return (
    <Box>
      <form onSubmit={searchAddressHandler}>
        <FormControl>
          <FormLabel>Calculate approximate route from shop:</FormLabel>
          {isLoaded && <Autocomplete>
            <Input type="text" ref={addressInputRef} />
          </Autocomplete>}
        </FormControl>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Searching"
          mt={4}
        >
          Calculate route
        </Button>

        {distance && duration && (
          <Box mt={2}>
            <Text>
              Distance: {distance} | Duration: ~{duration} (driving)
            </Text>
          </Box>
        )}
      </form>
      {isLoaded && (
        <Box id="map" borderRadius="md" mt={4}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: 49.84124,
              lng: 24.02755,
            }}
            zoom={15}
            onLoad={map => setMap(map)}
            options={{
              streetViewControl: false,
            }}
          >
            {directions && <DirectionsRenderer directions={directions} />}
            {/* I don't know why this marker dissapears after first renders.
            If I add the second marker, compiler rerenders app, and it is showed.
            But if I reload the page, it disappears again. I can add the third and etc.
            and it appear once, but then does not show... I have a couple of other problems, and i think
            it because of newer React version. If I have done conspicuous mistake
            I will be gladly to known about it:)*/}
            {/* <Marker position={{
              lat: 49.84124,
              lng: 24.02755,
            }} /> */}
          </GoogleMap>
        </Box>
      )}
    </Box>
  );
}

export default MapSearch;
