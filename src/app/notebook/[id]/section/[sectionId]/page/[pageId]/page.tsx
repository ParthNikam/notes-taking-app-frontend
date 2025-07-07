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
  updatedAt: string;
}

export default function PageEditor() {
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const notebookId = params.id as string;
  const sectionId = params.sectionId as string;
  const pageId = params.pageId as string;

  useEffect(() => {
    const fetchPage = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/"); return; }
      
      const res = await fetch(`/api/page/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const pageData = await res.json();
        setPage(pageData);
        setTitle(pageData.title);
        setContent(pageData.content);
      }
    };
    
    if (pageId) {
      fetchPage();
    }
  }, [pageId, router]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/page/${pageId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const updatedPage = await res.json();
      setPage(updatedPage);
      setIsEditing(false);
    }
  };

  if (!page) return <div>Loading...</div>;

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <BreadcrumbPage>{page.title}</BreadcrumbPage>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col mx-20">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">
              {isEditing ? (
                <input
                  className="bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              ) : (
                page.title
              )}
            </h1>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              {isEditing ? (
                <textarea
                  className="w-full h-96 p-4 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your content..."
                />
              ) : (
                <div className="w-full h-96 p-4 bg-gray-800 border border-gray-600 rounded overflow-y-auto whitespace-pre-wrap">
                  {content || "No content yet. Click Edit to start writing."}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p>Created: {new Date(page.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(page.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
} 