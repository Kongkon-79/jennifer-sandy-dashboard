import React from 'react'
import BlogContainer from './_components/blog-container'
import DashboardHeader from '@/components/ui/dashboard-header'

const BlogPage = () => {
  return (
    <div>
        <DashboardHeader
        title="Blogs Management"
        desc="Welcome back! Here's what's happening with your app today."
      />
        <BlogContainer/>
    </div>
  )
}

export default BlogPage