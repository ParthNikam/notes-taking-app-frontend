import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { sectionId } = await params;
  console.log("\n=== FRONTEND GET SECTION API START ===");
  console.log("Section ID:", sectionId);
  
  const token = req.headers.get("authorization");
  console.log("Authorization header present:", !!token);

  if (!token) {
    console.log("ERROR: No token provided");
    console.log("=== FRONTEND GET SECTION API END (401) ===");
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/section/${sectionId}`;
    console.log("Backend URL:", backendUrl);
    
    const backendRes = await axios.get(backendUrl, {
      headers: { Authorization: token }
    });
    
    console.log("Backend response status:", backendRes.status);
    console.log("Backend response data:", backendRes.data);
    console.log("=== FRONTEND GET SECTION API SUCCESS ===");
    
    return NextResponse.json(backendRes.data);
    
  } catch (error) {
    console.log("=== FRONTEND GET SECTION API ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.log("Axios error detected");
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: "Server error" };
      
      console.log("=== FRONTEND GET SECTION API END (Axios Error) ===");
      return NextResponse.json(data, { status });
    }
    
    console.log("Non-Axios error");
    console.log("=== FRONTEND GET SECTION API END (Generic Error) ===");
    
    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 