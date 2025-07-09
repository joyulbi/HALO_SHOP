import React, { useState } from "react";
import { Tabs } from "antd";
import AdminLayout from './AdminLayout';

import CampaignSeasonImages from "../../components/CampaignSeasonImagesManagement";
import CampaignSeasonTeams from "../../components/CampaignSeasonTeamsManagement";

const { TabPane } = Tabs;

const campaign = () => {
  const [activeKey, setActiveKey] = useState("images");

  return (
    <AdminLayout>
    <div style={{ padding: "1rem", width: "90vw", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>캠페인 관리자 페이지</h2>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <TabPane tab="시즌 이미지" key="images">
          <CampaignSeasonImages />
        </TabPane>
        <TabPane tab="시즌 팀" key="teams">
          <CampaignSeasonTeams />
        </TabPane>
      </Tabs>
    </div>
    </AdminLayout> 
  );
};

export default campaign;
