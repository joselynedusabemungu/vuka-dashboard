"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import "./settings.css";
import MainView from "./MainView.jsx";
import AccountView from "./AccountView.jsx";
import SecurityView from "./SecurityView.jsx";
import SupportView from "./SupportView.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import Toast from "./Toast.jsx";
import { api } from "../../lib/api";

export default function Settings() {
  const [view, setView] = useState("main");

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      subject: "",
      message: "",
    },
  });

  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .me()
      .then((profile) => {
        if (!active) return;
        form.setFieldValue("firstName", profile.first_name || "");
        form.setFieldValue("lastName", profile.last_name || "");
        form.setFieldValue("username", profile.username || "");
        form.setFieldValue("email", profile.email || "");
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleAccountSave = async (data) => {
    try {
      const updated = await api.updateMe({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      form.setFieldValue("firstName", updated.first_name || data.firstName);
      form.setFieldValue("lastName", updated.last_name || data.lastName);
      form.setFieldValue("email", updated.email || data.email);
      setView("main");
      setToast("Profile updated");
    } catch (error) {
      setToast(error?.message || "Could not update profile");
    }
  };

  const handleSecuritySave = async () => {
    try {
      await api.requestPasswordReset(form.state.values.email);
      setView("main");
      setToast("Password reset instructions have been sent to your email");
    } catch (error) {
      setToast(error?.message || "Could not request a password reset");
    }
  };

  const handleSupportSend = (data) => {
    setView("main");
    setToast("Message sent, we'll get back to you soon");
  };

  const handleSignOutConfirm = async () => {
    setSigningOut(true);
    try {
      await api.logout();
    } catch {}
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");
    sessionStorage.clear();
    setSigningOut(false);
    setConfirmingSignOut(false);
    router.replace("/login");
  };

  return (
    <div className="w-full max-w-4xl">
      <div key={view} className="animate-in fade-in duration-300">
        {view === "main" && (
          <MainView
            profile={form.state.values}
            avatarUrl={avatarUrl}
            onOpen={setView}
            onSignOutClick={() => setConfirmingSignOut(true)}
          />
        )}

        {view === "account" && (
          <AccountView
            form={form}
            avatarUrl={avatarUrl}
            onBack={() => setView("main")}
            onChangePhoto={() => fileInputRef.current?.click()}
            onSave={handleAccountSave}
          />
        )}

        {view === "security" && (
          <SecurityView
            email={form.state.values.email}
            onBack={() => setView("main")}
            onSave={handleSecuritySave}
          />
        )}

        {view === "support" && (
          <SupportView
            form={form}
            onBack={() => setView("main")}
            onSend={handleSupportSend}
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {confirmingSignOut && (
        <ConfirmModal
          title="Sign out?"
          body="You'll need to sign back in to access your dashboard."
          confirmLabel="Sign out"
          busy={signingOut}
          onConfirm={handleSignOutConfirm}
          onCancel={() => setConfirmingSignOut(false)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
