// components/Footer.tsx
"use client";

import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="pt-12 pb-8 text-gray-300">
      <div className="border-t border-neutral-800 text-center text-sm">
        <h1 className="pt-4">
          © {new Date().getFullYear()} Youtube Companion Dashboard. All rights
          reserved.
        </h1>
      </div>
    </footer>
  );
}
