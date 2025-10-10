"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-4 border-white bg-[#000000] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 space-y-12">
        {/* CTA Card */}
        <div className="bg-[#111827] border-4 border-white rounded-3xl px-8 sm:px-12 py-10 flex flex-col lg:flex-row items-center gap-8 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-4">
            <div className="bg-[#f59e0b] rounded-2xl p-2.5 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <Image
                src="/logo-bg.png"
                alt="PopReels Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold">Join the PopReels wave</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Share bold stories. Discover viral vibes.
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:ml-auto">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center bg-[#f59e0b] text-black border-4 border-white rounded-2xl px-6 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Start Creating
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center justify-center bg-white text-black border-4 border-white rounded-2xl px-6 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Explore Reels
            </Link>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="bg-[#1f2937] rounded-2xl p-2 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <Image
                  src="/logo-bg.png"
                  alt="PopReels Logo"
                  width={72}
                  height={72}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <span className="text-3xl font-bold block">PopReels</span>
                <span className="text-sm uppercase tracking-[0.3em]">Pop it. Reel it.</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Your playground for rapid-fire creativity. Capture the moment, remix the vibe, and inspire the next trend with an unapologetically retro flair.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "TikTok", href: "https://tiktok.com" },
                { label: "YouTube", href: "https://youtube.com" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-transparent text-white border-2 border-white rounded-xl px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-transform duration-200 hover:-translate-y-1"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 - Platform */}
          <div className="bg-[#111827] border-4 border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 overflow-hidden">
            <h3 className="text-xl font-bold">Platform</h3>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/home" className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span className="w-2 h-2 bg-white rounded-full" /> Home Feed
              </Link>
              <Link href="/upload" className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span className="w-2 h-2 bg-white rounded-full" /> Upload Studio
              </Link>
              <Link href="/profile" className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span className="w-2 h-2 bg-white rounded-full" /> Creator Hub
              </Link>
              <Link href="/messages" className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span className="w-2 h-2 bg-white rounded-full" /> Collab Inbox
              </Link>
            </div>
          </div>

          {/* Column 3 - Community */}
          <div className="bg-[#111827] border-4 border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <h3 className="text-xl font-bold">Community</h3>
            <div className="flex flex-col space-y-3 text-sm">
              <button
                type="button"
                className="flex items-center gap-2 text-left hover:translate-x-1 transition-transform"
              >
                <span className="w-2 h-2 bg-white rounded-full" /> Creator Playbook
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-left hover:translate-x-1 transition-transform"
              >
                <span className="w-2 h-2 bg-white rounded-full" /> Community Guidelines
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-left hover:translate-x-1 transition-transform"
              >
                <span className="w-2 h-2 bg-white rounded-full" /> Feedback Portal
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-left hover:translate-x-1 transition-transform"
              >
                <span className="w-2 h-2 bg-white rounded-full" /> Support Lounge
              </button>
            </div>
          </div>

          {/* Column 4 - Stay in the Loop */}
          <div className="bg-[#111827] border-4 border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <h3 className="text-xl font-bold">Stay in the Loop</h3>
            <p className="text-sm leading-relaxed">
              Weekly drops with creator spotlights, trend reports, and production hacks straight to your inbox.
            </p>
            <form
              className="flex w-full flex-col sm:flex-row sm:items-stretch gap-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full sm:flex-1 bg-[#374151] text-white border-2 border-white rounded-xl px-4 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
              <button
                type="submit"
                className="w-full sm:w-auto sm:shrink-0 bg-white text-black border-2 border-white rounded-xl px-5 py-3 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-transform duration-200 hover:-translate-y-1"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs opacity-70">
              We respect creators. No spam, just pure inspo.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-4 border-white pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} PopReels. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase">
            <button type="button" className="hover:underline">Privacy</button>
            <button type="button" className="hover:underline">Terms</button>
            <button type="button" className="hover:underline">Cookies</button>
            <button type="button" className="hover:underline">Contact</button>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em]">
            Made with ❤️ by Kaustubh Karnik
          </p>
        </div>
      </div>
    </footer>
  );
}
