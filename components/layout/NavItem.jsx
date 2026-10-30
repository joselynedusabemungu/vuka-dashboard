"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";

export default function NavItem({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const safeHref = href || "#";
  const active = pathname === safeHref;

  if (!Icon) return null;

  return (
    <Link
      href={safeHref}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-[16px] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
        active
          ? "bg-[#009450] font-bold text-white shadow-md"
          : "font-medium text-white hover:bg-[#009450] hover:text-white"
      }`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-white">
        <Icon size={22} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
      </span>
      <span className="text-white">{label}</span>
    </Link>
  );
}

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};
