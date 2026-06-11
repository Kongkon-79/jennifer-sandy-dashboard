import React from 'react'
import InquiriesManagementContainer from './_components/inquiries-management-container'
import DashboardHeader from '@/components/ui/dashboard-header'

const InquiriesManagementPage = () => {
  return (
    <div>
         <DashboardHeader title="Inquiries Management" desc="Welcome back! Here's what's happening with your app today."/>
        <InquiriesManagementContainer/>
    </div>
  )
}

export default InquiriesManagementPage