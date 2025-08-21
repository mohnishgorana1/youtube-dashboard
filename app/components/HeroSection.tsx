"use client";

import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { connectYoutube } from "@/actions/auth";
import React, { useState } from "react";
import { checkStatus, makeRequest } from "@/actions/accessRequests";
import toast from "react-hot-toast";
import { isValidEmail } from "@/helper";

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "request">("status");

  // email states
  const [statusEmail, setStatusEmail] = useState("");
  const [requestEmail, setRequestEmail] = useState("");

  // loading states
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);

  // response states
  const [responseCheckingStatus, setResponseCheckingStatus] = useState("");

  const openDialog = () => {
    setIsOpen(true);
  };
  const closeDialog = () => {
    setIsOpen(false);
    setResponseCheckingStatus("");
    setStatusEmail("");
    setRequestEmail("");
  };

  const handleRequestAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestEmail.trim()) {
      toast.error("Email cannot be empty!");
      return;
    }
    if (!isValidEmail(requestEmail)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setIsRequestingAccess(true);

    try {
      const res = await makeRequest(requestEmail);
      if (res.success) {
        toast.success(res.message);
        setRequestEmail("");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong while requesting access!");
      console.error(error);
    } finally {
      setIsRequestingAccess(false);
    }
  };
  const handleCheckStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusEmail.trim()) {
      toast.error("Email cannot be empty!");
      return;
    }
    if (!isValidEmail(statusEmail)) {
      toast.error("Please enter a valid email address!");
      return;
    }
    setIsCheckingStatus(true);
    try {
      const res = await checkStatus(statusEmail);
      if (res.success) {
        if (res.status === "approved") {
          toast.success(
            "Your request has been approved. You can now connect YouTube."
          );
          setResponseCheckingStatus("Approved");
        } else {
          toast("⏳ Your request is still pending for approval.");
          setResponseCheckingStatus("Pending");
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong while checking status!");
      console.error(error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

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
        <p className="mt-6">
          <span>
            Before connect with youtube please{" "}
            <button
              onClick={openDialog}
              className="underline text-orange-500 capitalize"
            >
              check your status
            </button>
          </span>
        </p>
      </motion.div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
          <div className="bg-zinc-900 text-white rounded-xl shadow-lg max-w-md w-full p-4 md:p-6  relative">
            <button
              onClick={closeDialog}
              className="absolute top-2 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex border-b border-zinc-700 mb-6">
              <button
                onClick={() => setActiveTab("status")}
                className={`flex-1 py-2 text-center ${
                  activeTab === "status"
                    ? "border-b-2 border-red-500 text-red-500 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Check Status
              </button>
              <button
                onClick={() => setActiveTab("request")}
                className={`flex-1 py-2 text-center ${
                  activeTab === "request"
                    ? "border-b-2 border-red-500 text-red-500 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Request Access
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "status" && (
              <form className="space-y-4" onSubmit={handleCheckStatusSubmit}>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm md:text-lg "
                  required
                  value={statusEmail}
                  onChange={(e) => setStatusEmail(e.target.value)}
                />

                {responseCheckingStatus === "Approved" && (
                  <p className="text-green-600 font-semibold text-sm">
                    Approved
                  </p>
                )}
                {responseCheckingStatus === "Pending" && (
                  <p className="text-yellow-600 font-semibold text-sm">
                    Pending
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isCheckingStatus}
                  className={`w-full py-2 rounded-lg font-semibold text-sm md:text-lg lg:text-lg 
                            ${
                              isCheckingStatus
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                >
                  {isCheckingStatus ? "Checking..." : "Check Status"}
                </button>
              </form>
            )}

            {activeTab === "request" && (
              <form className="space-y-4" onSubmit={handleRequestAccessSubmit}>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm md:text-lg "
                  required
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isRequestingAccess}
                  className={`w-full py-2 rounded-lg font-semibold text-sm md:text-lg lg:text-lg 
                              ${
                                isRequestingAccess
                                  ? "bg-emerald-400 cursor-not-allowed"
                                  : "bg-emerald-600 hover:bg-emerald-700"
                              }`}
                >
                  {isRequestingAccess ? "Requesting..." : "Request Access"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
