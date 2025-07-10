"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"



interface Notebooks {
  title: string;
  _id: string;
  createdAt: Date;
}


export default function Page() {
  const [user, setUser] = useState<unknown>(null);
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<Notebooks[]>([])
  const [creatingNotebook, setCreatingNotebook] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState("Untitled Notebook");
  const [notebookInputRef, setNotebookInputRef] = useState<HTMLInputElement | null>(null);


   useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/"); return; }
      const res = await fetch('/api/profile', {headers: { Authorization: `Bearer ${token}` },});
      const data = await res.json();
      setUser(data);
      setNotebooks(data.notebooks);
    };
    fetchUser();
  }, [router]);


  const handleNotebookCreate = async () => {
    if (!newNotebookTitle.trim()) return;
    setCreatingNotebook(false);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/notebook', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newNotebookTitle }),
    });
    if (res.ok) {
      const newNotebook = await res.json();
      setNotebooks(prevNotebooks => [...prevNotebooks, newNotebook]);
      router.push(`/notebook/${newNotebook.id}`);
    }
  };

  const handleNotebookClick = (notebookId: string) => {
    router.push(`/notebook/${notebookId}`);
  };

  const handleCancelCreate = () => {
    setCreatingNotebook(false);
    setNewNotebookTitle('Untitled Notebook');
  };


  if (!user) return <div>Loading...</div>;
 
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <BreadcrumbPage>Dashboard</BreadcrumbPage>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col mx-20">
          <p className="text-bold text-3xl mb-4">Notebooks</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {notebooks?.map((notebook: Notebooks) => (
              <li
                key={notebook._id}
                onClick={() => handleNotebookClick(notebook._id)}
                className="cursor-pointer transition-shadow hover:shadow-lg bg-white/10 border border-white/20 p-8 rounded-xl flex items-center justify-center text-lg font-semibold text-white min-h-[100px]"
                tabIndex={0}
                role="button"
                aria-label={`Open notebook ${notebook.title}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') handleNotebookClick(notebook._id);
                }}
              >
                {notebook.title}
              </li>
            ))}
            {creatingNotebook && (
              <li key="creating-notebook" className="bg-white/10 border-2 border-blue-400 p-8 rounded-xl flex items-center justify-center min-h-[100px]">
                <input
                  ref={input => {
                    if (input && !notebookInputRef) {
                      input.focus();
                      setNotebookInputRef(input);
                    }
                  }}
                  className="w-full p-2 border border-blue-500 rounded bg-black/60 text-white outline-none focus:ring-2 focus:ring-blue-400"
                  value={newNotebookTitle}
                  onChange={e => setNewNotebookTitle(e.target.value)}
                  onBlur={handleCancelCreate}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleNotebookCreate();
                    if (e.key === "Escape") handleCancelCreate();
                  }}
                  placeholder="Notebook title"
                />
              </li>
            )}
            <li key="create-button" className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setCreatingNotebook(true);
                  setNewNotebookTitle("Untitled Notebook");
                }}
                className="w-full h-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow transition-colors"
                aria-label="Create new notebook"
              >
                + Create Notebook
              </button>
            </li>
          </ul>
        </div> 
      </div>
    </SidebarInset>
  )
}
