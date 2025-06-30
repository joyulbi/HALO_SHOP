import React from "react";
import styled from 'styled-components';
import CampaignRank from "../components/CampaignRank";

const ListTop = styled.div`
  background-color: #000;
  width: 100vw;
  height: 50vh;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListBottom = styled.div`
  display: flex;
  justify-content: center;
`

const Campaign = () => {
  return (
    <>
      <ListTop>
        <CampaignRank />
      </ListTop>
      <ListBottom>
        
      </ListBottom>
    </>
  );
}

export default Campaign;
