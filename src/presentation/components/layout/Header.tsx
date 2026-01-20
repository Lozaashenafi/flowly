"use client";
import React, { useEffect, useState } from "react";
import { formatEth } from "../../../infrastructure/utils/ethiopianDate";

function Header() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="px-6 pt-8 pb-4">
      <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
        {isMounted ? formatEth(new Date()) : "---"}
      </p>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Welcome to Flowly
      </h1>
    </header>
  );
}

export default Header;
