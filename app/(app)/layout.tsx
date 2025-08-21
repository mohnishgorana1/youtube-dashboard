import { cookies } from "next/headers";
import "../globals.css";
import { disconnectYoutube } from "@/actions/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value
    ? decodeURIComponent(cookieStore.get("userEmail")!.value)
    : null;

  return (
    <main className="min-h-screen">
      <header className="px-4 lg:px-8 flex justify-between items-center py-3 bg-neutral-950 gap-x-2">
        <Link
          href={"/"}
          className="text-lg sm:text-2xl md:text-3xl font-semibold hover:opacity-90 transition"
        >
          <span className="text-red-100 mr-1">Youtube</span>
          <span className="text-red-500">Companion</span>
        </Link>
        {email && (
          <form action={disconnectYoutube}>
            <button
              type="submit"
              className="rounded-xl md:px-6 md:py-2 px-3 py-1 font-semibold bg-neutral-700 hover:bg-neutral-800 duration-200 cursor-pointer tracking-wide text-xs sm:text-sm "
            >
              Logout
            </button>
          </form>
        )}
      </header>
      <div className="flex flex-col justify-between bg-gradient-to-b from-bg-neutral-950 from-5% via-neutral-950/20 via-40% to-90% to-neutral-900 min-h-screen">
        {children}
      </div>
    </main>
  );
}
