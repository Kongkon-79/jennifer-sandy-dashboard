import React from "react";
import AddBlogForm from "./_components/add-blog-form";
import DashboardHeader from "@/components/ui/dashboard-header";

const AddBlogPage = () => {
  return (
    <div>
      <DashboardHeader
        title="Add Blog"
        desc="Welcome back! Here's what's happening with your app today."
      />
      <AddBlogForm />
    </div>
  );
};

export default AddBlogPage;
