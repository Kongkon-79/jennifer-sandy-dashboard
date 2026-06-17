import React from 'react'
import { DashboardOverview } from './_components/dashboard-overview'
import DashboardHeader from '@/components/ui/dashboard-header'
import RecentInquiries from './_components/recent-inquiries'
import RecentUsers from './_components/recent-users'
import RecentLandlords from './_components/recent-landlord'

const DashboardOverviewPage = () => {
  return (
    <div>
      <DashboardHeader title="Dashboard" desc="Welcome back! Here's what's happening with your app today."/>
      <DashboardOverview/>
      <RecentInquiries/>
      <RecentUsers/>
      <RecentLandlords/>
    </div>
  )
}

export default DashboardOverviewPage