import React, { useEffect, useState } from 'react';

const KakaoDraggableMap = ({ address = '인천광역시 미추홀구 문학동' }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 API키&autoload=false&libraries=services';
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const kakao = window.kakao;

        const container = document.getElementById('map');
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본: 서울
          level: 3,
        };

        const newMap = new kakao.maps.Map(container, mapOption);
        setMap(newMap);

        const geocoder = new kakao.maps.services.Geocoder();

        // 주소 → 좌표 변환
        geocoder.addressSearch(address, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            const position = new kakao.maps.LatLng(lat, lng);

            newMap.setCenter(position);

            const marker = new kakao.maps.Marker({
              map: newMap,
              position,
              draggable: true,
            });

            kakao.maps.event.addListener(marker, 'dragend', function () {
              const pos = marker.getPosition();
              console.log('📍 드래그된 위치:', pos.getLat(), pos.getLng());
            });
          } else {
            alert('주소를 찾을 수 없습니다.');
          }
        });
      });
    };

    document.head.appendChild(script);
  }, [address]);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '350px' }} />
      <p><em>택배 받을 주소: {address}</em></p>
    </div>
  );
};

export default KakaoDraggableMap;
