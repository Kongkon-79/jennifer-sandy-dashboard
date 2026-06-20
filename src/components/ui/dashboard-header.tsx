import React from "react";
import LanguageSwitcher from "../language-switcher";

type DashboardHeaderProps = {
  title: string;
  desc: string;
};

const DashboardHeader = ({ title, desc }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F8F9FA]/95 backdrop-blur-sm">
      <div className="flex w-full flex-col gap-4 rounded-[14px] border border-[#E6E7E6] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold leading-[130%] text-primary md:text-3xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-[170%] text-[#68706A] md:text-base">
              {desc}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 justify-start lg:justify-end">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
