import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center justify-start gap-4">
      <Image height={50} width={50} src="/logo.svg" alt="logo" />{" "}
      <p className="font-semibold text-slate-500 text-md md:text-xl">
        SkillCraft
      </p>
    </div>
  );
};

export default Logo;
