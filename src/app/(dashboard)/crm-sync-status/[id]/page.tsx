import React from "react";
import CrmSyncViewContainer from "./_components/crm-sync-view-container";
import DashboardHeader from "@/components/ui/dashboard-header";

const CrmSyncViewPage = () => {
  return (
    <div>
      <DashboardHeader
        title="CRM Sync Status Details"
        desc="Welcome back! Here's what's happening with your app today."
      />
      <CrmSyncViewContainer />
    </div>
  );
};

export default CrmSyncViewPage;
