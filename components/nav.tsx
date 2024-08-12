"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Q & A", href: "/questions" },
];

function Nav() {
  const currentPath = usePathname();
  return (
    <nav className=" w-full mx-auto h-16 flex gap-4 items-center justify-center">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`z-20 text-2xl font-semibold leading-6 hover:text-gray-900 ${currentPath == item.href ? "text-gray-900" : "text-gray-600"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-300`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export default Nav;
