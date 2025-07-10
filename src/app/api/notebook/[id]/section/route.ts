import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("\n=== FRONTEND CREATE SECTION API START ===");
  console.log("Notebook ID:", id);
  
  const token = req.headers.get("authorization");
  console.log("Authorization header present:", !!token);

  if (!token) {
    console.log("ERROR: No token provided");
    console.log("=== FRONTEND CREATE SECTION API END (401) ===");
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/notebook/${id}/section`;
    console.log("Backend URL:", backendUrl);
    
    const backendRes = await axios.post(backendUrl, requestBody, {
      headers: { Authorization: token }
    });
    
    console.log("Backend response status:", backendRes.status);
    console.log("Backend response data:", backendRes.data);
    console.log("=== FRONTEND CREATE SECTION API SUCCESS ===");
    
    return NextResponse.json(backendRes.data);
    
  } catch (error) {
    console.log("=== FRONTEND CREATE SECTION API ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.log("Axios error detected");
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: "Server error" };
      
      console.log("=== FRONTEND CREATE SECTION API END (Axios Error) ===");
      return NextResponse.json(data, { status });
    }
    
    console.log("Non-Axios error");
    console.log("=== FRONTEND CREATE SECTION API END (Generic Error) ===");
    
    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 