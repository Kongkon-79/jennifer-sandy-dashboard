import React from 'react'
import { DashboardOverview } from './_components/dashboard-overview'
import DashboardHeader from '@/components/ui/dashboard-header'
import RecentInquiries from './_components/recent-inquiries'
import CrmStatusSummary from './_components/crm-status-summary'

const DashboardOverviewPage = () => {
  return (
    <div>
      <DashboardHeader title="Dashboard" desc="Welcome back! Here's what's happening with your app today."/>
      <DashboardOverview/>
      <RecentInquiries/>
      <CrmStatusSummary/>
    </div>
  )
}

export default DashboardOverviewPage