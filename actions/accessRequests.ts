"use server";

import connectDB from "@/config/db";
import Request from "@/models/request.model";

// Create a new request
export async function makeRequest(email: string) {
  await connectDB();

  

  try {
    // check if request already exists
    const existing = await Request.findOne({ email });
    if (existing) {
      return {
        success: false,
        message: `Request already exists with status: ${existing.status}`,
        userStatus: existing.status,
      };
    }

    // create new request
    const req = new Request({ email });
    await req.save();

    return { success: true, message: "Request submitted successfully!" };
  } catch (error) {
    console.error("makeRequest error:", error);
    return { success: false, message: "Something went wrong!" };
  }
}

// Check request status
export async function checkStatus(email: string) {
  await connectDB();
  console.log("check status email", email);
  
  try {
    const request = await Request.findOne({ email });

    if (!request) {
      return {
        success: false,
        status: "not_found",
        message: "No request found. Please Make a New Request",
      };
    }

    return {
      success: true,
      status: request.status,
      message: `Request status: ${request.status}`,
    };
  } catch (error) {
    console.error("checkStatus error:", error);
    return {
      success: false,
      status: "error",
      message: "Something went wrong!",
    };
  }
}
