import React from "react";

function Header() {
  const today = new Date();
  return (
    <header className="px-6 pt-8 pb-4">
      <p className="text-gray-500 text-sm font-medium">
        {today.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        Welcome to Flowly
      </h1>
    </header>
  );
}

export default Header;
