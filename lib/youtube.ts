import { google } from "googleapis";
import connectDB from "@/config/db";
import User from "@/models/user.model";
import { cookies } from "next/headers";

export async function getYoutubeClient() {
  await connectDB();

  // ✅ Cookies
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value
    ? decodeURIComponent(cookieStore.get("userEmail")!.value)
    : null;

  if (!email) throw new Error("Not authenticated");

  // ✅ User find from DB
  const user = await User.findOne({ email });
  if (!user?.youtube?.accessToken) throw new Error("YouTube not connected");

  // ✅ OAuth client setup
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: user.youtube.accessToken,
    refresh_token: user.youtube.refreshToken,
  });

  // ✅ YouTube client return krna
  return google.youtube({ version: "v3", auth: oauth2Client });
}
