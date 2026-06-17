import React from "react";
import LanguageSwitcher from "../language-switcher";

const DashboardHeader = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className="sticky top-0  z-50">
      <div className="w-full flex items-center justify-between flex-col lg:flex-row gap-4">
        {/* Header */}
        <div className="bg-white p-6 ">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary leading-[150%]">
            {title}
          </h1>
          <p className="text-sm font-normal text-[#68706A] leading-[150%]">
            {desc}
          </p>
        </div>
        {/* Language Switcher */}
        <div className="bg-gray-50">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
