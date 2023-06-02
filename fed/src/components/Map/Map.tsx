import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, RefObject } from 'react';

function Map({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    new window.google.maps.Map(ref.current!, {
      center,
      zoom,
    });
  }, [center, zoom]);

  return <Box ref={ref as RefObject<HTMLDivElement>} id="map"  aspectRatio={'16/9'}  borderRadius={'md'}/>;
}

export default Map;
