import React from 'react';
import DeliveryForm from '../components/DeliveryForm';
import DeliveryTrackingList from '../components/DeliveryTrackingList';

const DeliveryPage = ({ accountId }) => {
  return (
    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div>
            <h2>배송 정보 입력</h2>
            <DeliveryForm accountId={1} onSubmitSuccess={() => window.location.reload()} />

            <hr />

            <DeliveryTrackingList accountId={1} />
        </div>
    </div>
  );
};

export default DeliveryPage;
