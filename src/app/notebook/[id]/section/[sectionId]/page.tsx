"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface Page {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Section {
  _id: string;
  title: string;
  createdAt: string;
}

export default function SectionPage() {
  const [section, setSection] = useState<Section | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [creatingPage, setCreatingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("Untitled Page");
  const router = useRouter();
  const params = useParams();
  const notebookId = params.id as string;
  const sectionId = params.sectionId as string;

  useEffect(() => {
    const fetchSection = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/"); return; }
      
      const res = await fetch(`/api/section/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setSection(data.section);
        setPages(data.pages);
      }
    };
    
    if (sectionId) {
      fetchSection();
    }
  }, [sectionId, router]);

  const handlePageCreate = async () => {
    if (!newPageTitle.trim()) return;
    setCreatingPage(false);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/section/${sectionId}/page`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newPageTitle }),
    });

    if (res.ok) {
      const newPage = await res.json();
      setPages(prevPages => [...prevPages, newPage]);
    }
  };

  if (!section) return <div>Loading...</div>;

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <BreadcrumbPage>{section.title}</BreadcrumbPage>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col mx-20">
          <p className="text-bold text-3xl mb-4">Pages</p>
          <ul className="flex flex-col gap-4">
            {pages.map((page) => (
              <li 
                key={page._id} 
                className="w-full border border-1 border-white p-6 rounded-lg cursor-pointer hover:bg-gray-800"
                onClick={() => router.push(`/notebook/${notebookId}/section/${sectionId}/page/${page._id}`)}
              >
                <h3 className="text-lg font-semibold">{page.title}</h3>
                <p className="text-sm text-gray-400">
                  Created: {new Date(page.createdAt).toLocaleDateString()}
                </p>
                {page.content && (
                  <p className="text-sm text-gray-300 mt-2 truncate">
                    {page.content.substring(0, 100)}...
                  </p>
                )}
              </li>
            ))}
            {creatingPage && (
              <li key="creating-page" className="w-full border-2 border-blue-500 p-6 rounded-lg bg-blue-50">
                <input
                  className="w-full p-2 border border-blue-500 rounded"
                  value={newPageTitle}
                  onChange={e => setNewPageTitle(e.target.value)}
                  onBlur={handlePageCreate}
                  onKeyDown={e => {
                    if (e.key === "Enter") handlePageCreate();
                  }}
                  autoFocus
                />
              </li>
            )}
            <li key="create-page-button">
              <button 
                onClick={() => {
                  setCreatingPage(true);
                  setNewPageTitle("Untitled Page");
                }}
                className="w-full border-2 border-dashed border-gray-500 p-6 rounded-lg hover:border-blue-500 hover:text-blue-500"
              >
                + Create Page
              </button>
            </li>
          </ul>
        </div>
      </div>
    </SidebarInset>
  );
} 