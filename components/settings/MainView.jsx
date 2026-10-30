"use client";

import {
  User,
  Lock,
  Sparkles,
  ChevronRight,
  LogOut,
  Target,
} from "lucide-react";
import PropTypes from "prop-types";
import Link from "next/link";
import Avatar from "./Avatar.jsx";

export default function MainView({
  profile,
  avatarUrl,
  onOpen,
  onSignOutClick,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl bg-[#072540] p-6 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="rounded-full border-2 border-[#009450] p-1">
            <Avatar
              url={avatarUrl}
              initial={(profile.firstName || "U").charAt(0)}
              size={64}
            />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {profile.firstName || "User"}
            </p>
            <p className="text-sm text-blue-200">{profile.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpen("account")}
          className="rounded-xl bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#009450]"
        >
          Edit
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#072540] shadow-lg">
        <div className="flex flex-col divide-y divide-white/10">
          <button
            type="button"
            className="group flex items-center justify-between p-6 transition hover:bg-white/5"
            onClick={() => onOpen("account")}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009450]/20 text-[#00b864]">
                <User size={20} />
              </div>
              <span className="font-semibold text-white transition-colors group-hover:text-[#00b864]">
                Account Profile
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-blue-200 transition-colors group-hover:text-[#00b864]"
            />
          </button>

          <Link
            href="/onboarding"
            className="group flex items-center justify-between p-6 transition hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009450]/20 text-[#00b864]">
                <Target size={20} />
              </div>
              <div>
                <span className="block font-semibold text-white transition-colors group-hover:text-[#00b864]">
                  Learning Profile
                </span>
                <span className="block text-xs text-blue-200">
                  Retake assessment & update goals
                </span>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-blue-200 transition-colors group-hover:text-[#00b864]"
            />
          </Link>

          <button
            type="button"
            className="group flex items-center justify-between p-6 transition hover:bg-white/5"
            onClick={() => onOpen("security")}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009450]/20 text-[#00b864]">
                <Lock size={20} />
              </div>
              <span className="font-semibold text-white transition-colors group-hover:text-[#00b864]">
                Security & Privacy
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-blue-200 transition-colors group-hover:text-[#00b864]"
            />
          </button>

          <button
            type="button"
            className="group flex items-center justify-between p-6 transition hover:bg-white/5"
            onClick={() => onOpen("support")}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009450]/20 text-[#00b864]">
                <Sparkles size={20} />
              </div>
              <span className="font-semibold text-white transition-colors group-hover:text-[#00b864]">
                Help & Support
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-blue-200 transition-colors group-hover:text-[#00b864]"
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 py-4 font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
        onClick={onSignOutClick}
      >
        <LogOut size={20} />
        Sign out of account
      </button>
    </div>
  );
}

MainView.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  avatarUrl: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired,
};
