import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  console.log("\n=== FRONTEND NOTEBOOK API START ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  
  const token = req.headers.get("authorization");
  console.log("Authorization header present:", !!token);
  console.log("Token (first 20 chars):", token ? token.substring(0, 20) + "..." : "null");

  if (!token) {
    console.log("ERROR: No token provided");
    console.log("=== FRONTEND NOTEBOOK API END (401) ===");
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const requestBody = await req.json();
    const { title } = requestBody;
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/notebook`;
    
    // send a put requst to the backend with notebook title
    const backendRes = await axios.put(
      backendUrl,
      { title },
      { headers: { Authorization: token } }
    );
    
    console.log("Backend response status:", backendRes.status);
    console.log("Backend response data:", backendRes.data);
    console.log("=== FRONTEND NOTEBOOK API SUCCESS ===");
    
    return NextResponse.json(backendRes.data);
    
  } catch (error) {
    console.log("=== FRONTEND NOTEBOOK API ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.log("Axios error detected");
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      console.log("Request config:", {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: "Server error" };
      
      console.log("=== FRONTEND NOTEBOOK API END (Axios Error) ===");
      return NextResponse.json(data, { status });
    }
    
    console.log("Non-Axios error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.log("=== FRONTEND NOTEBOOK API END (Generic Error) ===");
    
    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
