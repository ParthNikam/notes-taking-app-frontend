"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const ROLES = [
  "Admin",
  "Editor",
  "Viewer",
  "Contributor",
  "Guest"
];

export default function SettingsPage() {
  const [user, setUser] = useState<unknown>(null);
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [role, setRole] = useState<string>(ROLES[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/"); return; }
      const res = await fetch('/api/profile', {headers: { Authorization: `Bearer ${token}` },});
      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setAvatar(data.avatar || "");
      setRole(data.role || ROLES[0]);
    };
    fetchUser();
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const token = localStorage.getItem("token");
    const res = await fetch('/api/settings', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, avatar, role })
    });
    setLoading(false);
    if (res.ok) setSuccess(true);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <BreadcrumbPage>Settings</BreadcrumbPage>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Name:
            <input
              className="border rounded px-2 py-1 w-full"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Avatar URL:
            <input
              className="border rounded px-2 py-1 w-full"
              type="text"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              required
            />
          </label>
          <label>
            Role:
            <select
              className="border rounded bg-black text-white px-2 py-1 w-full"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {success && <div className="text-green-600">Settings updated!</div>}
        </form>
      </div>
    </SidebarInset>
  );
}
