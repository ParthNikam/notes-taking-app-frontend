import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { pageId: string } }
) {
  console.log("\n=== FRONTEND GET PAGE API START ===");
  console.log("Page ID:", params.pageId);
  
  const token = req.headers.get("authorization");
  console.log("Authorization header present:", !!token);

  if (!token) {
    console.log("ERROR: No token provided");
    console.log("=== FRONTEND GET PAGE API END (401) ===");
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/page/${params.pageId}`;
    console.log("Backend URL:", backendUrl);
    
    const backendRes = await axios.get(backendUrl, {
      headers: { Authorization: token }
    });
    
    console.log("Backend response status:", backendRes.status);
    console.log("Backend response data:", backendRes.data);
    console.log("=== FRONTEND GET PAGE API SUCCESS ===");
    
    return NextResponse.json(backendRes.data);
    
  } catch (error) {
    console.log("=== FRONTEND GET PAGE API ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.log("Axios error detected");
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: "Server error" };
      
      console.log("=== FRONTEND GET PAGE API END (Axios Error) ===");
      return NextResponse.json(data, { status });
    }
    
    console.log("Non-Axios error");
    console.log("=== FRONTEND GET PAGE API END (Generic Error) ===");
    
    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { pageId: string } }
) {
  console.log("\n=== FRONTEND UPDATE PAGE API START ===");
  console.log("Page ID:", params.pageId);
  
  const token = req.headers.get("authorization");
  console.log("Authorization header present:", !!token);

  if (!token) {
    console.log("ERROR: No token provided");
    console.log("=== FRONTEND UPDATE PAGE API END (401) ===");
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/page/${params.pageId}`;
    console.log("Backend URL:", backendUrl);
    
    const backendRes = await axios.put(backendUrl, requestBody, {
      headers: { Authorization: token }
    });
    
    console.log("Backend response status:", backendRes.status);
    console.log("Backend response data:", backendRes.data);
    console.log("=== FRONTEND UPDATE PAGE API SUCCESS ===");
    
    return NextResponse.json(backendRes.data);
    
  } catch (error) {
    console.log("=== FRONTEND UPDATE PAGE API ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.log("Axios error detected");
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: "Server error" };
      
      console.log("=== FRONTEND UPDATE PAGE API END (Axios Error) ===");
      return NextResponse.json(data, { status });
    }
    
    console.log("Non-Axios error");
    console.log("=== FRONTEND UPDATE PAGE API END (Generic Error) ===");
    
    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 