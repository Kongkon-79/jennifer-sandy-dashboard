import React from 'react'
import UserManagementContainer from './_components/user-management-container'
import DashboardHeader from '@/components/ui/dashboard-header'

const UserManagementPage = () => {
  return (
    <div>
         <DashboardHeader title="User Management" desc="Manage all platform users"/>
        <UserManagementContainer/>
    </div>
  )
}

export default UserManagementPage