import DashboardHeader from '@/components/ui/dashboard-header'
import React from 'react'
import ContactManagementContainer from './_components/contact-management-container'

const ContactManagementPage = () => {
  return (
    <div>
        <DashboardHeader title="Contact Management" desc="Review and moderate property listings"/>
        <ContactManagementContainer/>
    </div>
  )
}

export default ContactManagementPage