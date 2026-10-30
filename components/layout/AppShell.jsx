"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import { api, clearAuth, getAccessToken } from "../../lib/api";

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (!getAccessToken()) {
      router.replace(
        `/login?next=${encodeURIComponent(pathname || "/Dashboard/home")}`,
      );
      return () => {
        active = false;
      };
    }

    api
      .me()
      .then(() => {
        if (active) setReady(true);
      })
      .catch((error) => {
        if (!active) return;
        if (error?.status === 401) clearAuth();
        router.replace(
          `/login?next=${encodeURIComponent(pathname || "/Dashboard/home")}`,
        );
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#072540]" />
      </div>
    );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />
      <main className="h-full flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl pb-20">{children}</div>
      </main>
    </div>
  );
}

AppShell.propTypes = { children: PropTypes.node.isRequired };
