import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  await connectDB();
  console.log("inside callback");

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    console.log("tokens", tokens);

    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const channelRes = await youtube.channels.list({
      part: ["id", "snippet"],
      mine: true,
    });
    const channelId = channelRes.data.items?.[0]?.id;
    console.log("channelId", channelId);

    // Get user's email from Google API
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;
    const name = userInfo.data.name;
    const imageUrl = userInfo.data.picture;
    const profileUrl = userInfo.data.link;

    if (!email) {
      return NextResponse.json(
        { error: "Failed to get email from Google" },
        { status: 500 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        imageUrl,
        profileUrl,
        channelId,
        youtube: {
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token!,
          expiryDate: tokens.expiry_date!,
        },
      });
    } else {
      // optional: update fields if missing
      user.name = name || user.name;
      user.imageUrl = imageUrl || user.imageUrl;
      user.profileUrl = profileUrl || user.profileUrl;
      user.channelId = channelId || user.channelId; // also update channelId if changed
      user.youtube = {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token! ?? user.youtube?.refreshToken,
        expiryDate: tokens.expiry_date!,
      };
      await user.save();
    }

    // Set email in cookie
    const res = NextResponse.redirect(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ); // redirect to dashboard

    res.cookies.set({
      name: "userEmail",
      value: email,
      path: "/",
      httpOnly: true, // secure
      sameSite: "lax",
    });
    res.cookies.set({
      name: "userName",
      value: encodeURIComponent(name!),
      path: "/",
      httpOnly: true, // secure
      sameSite: "lax",
    });
    res.cookies.set({
      name: "userId",
      value: user._id.toString(), // ✅ store Mongo _id
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    if (channelId) {
      res.cookies.set({
        name: "channelId",
        value: channelId,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return res;
  } catch (err: any) {
    console.error(
      "OAuth callback error:",
      err.response?.data || err.message || err
    );
    return NextResponse.json(
      { error: "Failed to authenticate with Google" },
      { status: 500 }
    );
  }
}
