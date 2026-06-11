import React from 'react'
import CrmSyncStatusContainer from './_components/crm-sync-status-container'
import DashboardHeader from '@/components/ui/dashboard-header'

const CrySyncPage = () => {
  return (
    <div>
        <DashboardHeader
        title="CRM Sync Status"
        desc="Welcome back! Here's what's happening with your app today."
      />
        <CrmSyncStatusContainer/>
    </div>
  )
}

export default CrySyncPage