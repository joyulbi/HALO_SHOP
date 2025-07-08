import React from 'react';
import Lottie from 'lottie-react';
import sirenAnimation from '../../public/lottie/siren.json';

const SirenLottie = () => {
  return (
    <div style={{ width: 60, height: 60 }}>
      <Lottie animationData={sirenAnimation} loop={true} />
    </div>
  );
};

export default SirenLottie;
