import AppShell from "../../components/layout/AppShell";
import Settings from "../../components/settings/Settings";

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#072540]">Settings</h1>
          <p className="mt-2 text-slate-500">
            Manage your account preferences and security.
          </p>
        </header>
        <Settings />
      </div>
    </AppShell>
  );
}
