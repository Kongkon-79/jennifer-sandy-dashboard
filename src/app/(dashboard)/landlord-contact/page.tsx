import React from "react";
import LandlordContactContainer from "./_component/landlord-contact-container";
import DashboardHeader from "@/components/ui/dashboard-header";

const LandlordContactPage = () => {
  return (
    <div>
      <DashboardHeader
        title="Landlord Contact  Information"
        desc="Welcome back! Here's what's happening with your app today."
      />
      <LandlordContactContainer />
    </div>
  );
};

export default LandlordContactPage;
