import React, { useEffect, useState, useRef } from 'react';

const KakaoDraggableMap = ({ address: initialAddress }) => {
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState(initialAddress || '');
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=fd0dad7884ce6e58e2c56e734da2c8c8&autoload=false&libraries=services';
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const { kakao } = window;
        const container = mapRef.current;
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };

        const newMap = new kakao.maps.Map(container, mapOption);
        setMap(newMap);

        if (address) {
          const geocoder = new kakao.maps.services.Geocoder();
          searchAddressAndMark(geocoder, newMap, address);
        }
      });
    };

    document.head.appendChild(script);

    const postcodeScript = document.createElement('script');
    postcodeScript.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    postcodeScript.async = true;
    document.head.appendChild(postcodeScript);
  }, []);

  useEffect(() => {
    if (map && window.kakao && address) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      searchAddressAndMark(geocoder, map, address);
    }
  }, [address, map]);

  const searchAddressAndMark = (geocoder, mapInstance, searchAddr) => {
    geocoder.addressSearch(searchAddr, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);
        const position = new window.kakao.maps.LatLng(lat, lng);

        mapInstance.setCenter(position);

        const marker = new window.kakao.maps.Marker({
          map: mapInstance,
          position: position,
          draggable: true,
        });

        window.kakao.maps.event.addListener(marker, 'dragend', function () {
          const pos = marker.getPosition();
          console.log('📍 드래그된 위치:', pos.getLat(), pos.getLng());
        });
      } else {
        alert('주소를 찾을 수 없습니다.');
      }
    });
  };

  return (
    <div>
      <div
        ref={mapRef}
        id="map"
        style={{ width: '100%', height: '350px', borderRadius: '8px' }}
      />
    </div>
  );
};

export default KakaoDraggableMap;
