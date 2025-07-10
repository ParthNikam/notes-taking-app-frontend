"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface Section {
  _id: string;
  title: string;
  createdAt: string;
}

interface Notebook {
  _id: string;
  title: string;
  createdAt: string;
}

export default function NotebookPage() {
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [creatingSection, setCreatingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("Untitled Section");
  
  const router = useRouter();
  const params = useParams();
  const notebookId = params.id as string;

  useEffect(() => {
    const fetchNotebook = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/"); return; }
      
      const res = await fetch(`/api/notebook/${notebookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setNotebook(data.notebook);
        setSections(data.sections);
      }
    };
    
    if (notebookId) {
      fetchNotebook();
    }
  }, [notebookId, router]);

  const handleSectionCreate = async () => {
    if (!newSectionTitle.trim()) return;
    setCreatingSection(false);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/notebook/${notebookId}/section`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newSectionTitle }),
    });

    if (res.ok) {
      const newSection = await res.json();
      setSections(prevSections => [...prevSections, newSection]);
    }
  };

  if (!notebook) return <div>Loading...</div>;

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <BreadcrumbPage>{notebook.title}</BreadcrumbPage>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col mx-20">
          <p className="text-bold text-3xl mb-4">Sections</p>
          <ul className="flex flex-col gap-4">
            {sections.map((section) => (
              <li 
                key={section._id} 
                className="w-full border border-1 border-white p-6 rounded-lg cursor-pointer hover:bg-gray-800"
                onClick={() => router.push(`/notebook/${notebookId}/section/${section._id}`)}
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-gray-400">
                  Created: {new Date(section.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
            {creatingSection && (
              <li key="creating-section" className="w-full border-2 border-blue-500 p-6 rounded-lg">
                <input
                  className="w-full p-2 border border-blue-500 rounded"
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  onBlur={handleSectionCreate}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleSectionCreate();
                  }}
                  autoFocus
                />
              </li>
            )}
            <li key="create-section-button">
              <button 
                onClick={() => {
                  setCreatingSection(true);
                  setNewSectionTitle("Untitled Section");
                }}
                className="w-full border-2 border-dashed border-gray-500 p-6 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                + Create Section
              </button>
            </li>
          </ul>
        </div>
      </div>
    </SidebarInset>
  );
}