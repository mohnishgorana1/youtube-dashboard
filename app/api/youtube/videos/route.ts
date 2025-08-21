import { NextResponse } from "next/server";
import { google } from "googleapis";
import connectDB from "@/config/db";
import User from "@/models/user.model";

export async function GET(req: Request) {
  console.log("fetching videos");

  try {
    await connectDB();

    // Get cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );
    const email = cookies.userEmail
      ? decodeURIComponent(cookies.userEmail)
      : null;

    console.log("email", email);

    if (!email) {
      console.log("no email");

      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ email });
    if (!user?.youtube?.accessToken) {
      console.log("no user");

      return NextResponse.json(
        { error: "YouTube not connected" },
        { status: 400 }
      );
    }
    console.log("user", user);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      access_token: user.youtube.accessToken,
      refresh_token: user.youtube.refreshToken,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // console.log("yt", youtube);

    // Get the user's channel ID
    const channelRes = await youtube.channels.list({
      part: ["id"],
      mine: true,
    });

    const channelId = channelRes.data.items?.[0].id;
    if (!channelId) throw new Error("Channel not found");
    const searchRes = await youtube.search.list({
      part: ["id", "snippet"],
      channelId,
      maxResults: 10,
      order: "date", // latest first
      type: ["video"],
    });

    if (searchRes?.data?.items) {
      console.log("first item", searchRes?.data?.items[0]);
    }

    const items = searchRes.data.items?.map((v: any) => ({
      id: v.id?.videoId,
      title: v.snippet?.title || "",
      description: v.snippet?.description || "",
      thumbnail: v.snippet?.thumbnails?.medium?.url || "",
      videoId: v.id?.videoId || "",
    }));

    console.log("items ", items);

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error(
      "Error fetching YouTube videos:",
      err.response?.data || err.message || err
    );
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
