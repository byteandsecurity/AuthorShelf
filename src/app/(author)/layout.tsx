import Link from 'next/link'
import React from "react"
import Sidebar from "@/components/(author)/dashboard/Sidebar"

export default function AuthorLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#EAE6DF]/40 text-zinc-900 relative overflow-hidden font-sans">
            {/* 🎨 Low-Opacity Branded Watermark Background Motif Layer */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] bg-repeat select-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='55' font-family='Georgia, serif' font-weight='bold' font-size='28' fill='%232D4A3E'%3EA%3C/text%3E%3Ctext x='55' y='95' font-family='Georgia, serif' font-weight='bold' font-size='28' fill='%232D4A3E'%3ES%3C/text%3E%3C/svg%3E")`,
                    backgroundSize: '140px 140px'
                }}
            />

            {/* Author Sidebar Navigation */}
            <Sidebar />

            {/* Main Author Workspace */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
                    <Link href="/dashboard" className="font-serif text-xl font-bold text-[#2D4A3E]">
                        AuthorShelf.
                    </Link>
                    <div className="flex gap-4 text-sm font-semibold text-zinc-700">
                        <Link href="/author-profile" className="hover:text-[#2D4A3E]">Profile</Link>
                        <Link href="/author-works" className="hover:text-[#2D4A3E]">Works</Link>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    )
}