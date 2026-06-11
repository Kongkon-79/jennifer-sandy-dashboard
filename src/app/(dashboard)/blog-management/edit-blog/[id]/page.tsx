import React from "react";
import EditBlogForm from "./_components/edit-blog-form";
import DashboardHeader from "@/components/ui/dashboard-header";

type Props = {
  params: Promise<{ id: string }>;
};

const EditBlogPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div>
      <DashboardHeader
        title="Edit Blog"
        desc="Keep track of all your apartment, update details, and stay organized."
      />
      <EditBlogForm blogId={id} />
    </div>
  );
};

export default EditBlogPage;