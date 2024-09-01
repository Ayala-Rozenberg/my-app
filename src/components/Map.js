import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXlhbGFybyIsImEiOiJjbTBmbjRzdmIweTVzMmxyNHQ2MGxsdDcxIn0.303zMhD08Z17E7OYmwv7Dw';

const Map = ({ geoJsonData }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-98.5795, 39.8283], // Center of the USA
      zoom: 4,
    });

    if (geoJsonData?.features[0]) {
      map.on('load', () => {
        map.addSource('zipcode', {
          type: 'geojson',
          data: geoJsonData,
        });

        map.addLayer({
          id: 'zipcode-boundary',
          type: 'fill',
          source: 'zipcode',
          layout: {},
          paint: {
            'fill-color': '#888888',
            'fill-opacity': 0.4,
          },
        });

        const bounds = new mapboxgl.LngLatBounds();
        geoJsonData.features[0]?.geometry?.coordinates[0]?.forEach((coord) =>
          bounds.extend(coord)
        );
        map.fitBounds(bounds, { padding: 20 });
      });
    }

    return () => map.remove();
  }, [geoJsonData]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
