"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const connectYoutube = async () => {
  redirect("/api/google/auth");
};

export const disconnectYoutube = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("userEmail");
  cookieStore.delete("userName");
  cookieStore.delete("channelId")
  cookieStore.delete("userId")

};
