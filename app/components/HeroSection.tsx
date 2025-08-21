"use client";

import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { connectYoutube } from "@/actions/auth";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 ">
      {/* Floating Blobs Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-0 overflow-hidden"
      >
        {/* Blob 1 */}
        <motion.div
          className="absolute top-20 lg:w-72 lg:h-72 w-36 h-36 bg-red-500/30 rounded-full blur-3xl"
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Blob 2 */}
        <motion.div
          className="absolute lg:w-96 lg:h-96 w-36 h-36 bg-red-700/20  rounded-full blur-3xl right-0 bottom-0"
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg max-w-xl lg:max-w-2xl w-full p-8 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            YouTube Companion
          </span>
        </h1>
        <p className="opacity-80 mb-6">
          Connect your YouTube account to manage your videos, update titles and
          descriptions, engage with comments, and add personal notes or tags for
          better organization.
        </p>

        <form action={connectYoutube}>
          <button
            type="submit"
            className="px-6 py-3 font-semibold bg-red-600 hover:bg-red-700 transition flex items-center gap-x-2 justify-center shadow-md hover:shadow-lg rounded-lg mx-auto"
          >
            <FaYoutube className="text-xl" />
            <span className="text-lg">
              Connect <span className="hidden md:inline">With Youtube</span>
            </span>
          </button>
        </form>
      </motion.div>
    </section>
  );
}
