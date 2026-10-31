import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
    BookOpen,
    Users,
    Eye,
    MessageSquare,
    Plus,
    ArrowUpRight,
    Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AuthorDashboardPage() {
    const supabase = await createClient()

    // 1. Secure server-side authentication check
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        redirect('/author-login')
    }

    const authorName = user.user_metadata?.pen_name || user.user_metadata?.full_name || 'Creator'

    // 2. Fetch active works count securely from Supabase
    const { count: activeWorksCount, error: booksError } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)

    const totalBooks = activeWorksCount || 0

    return (
        <div className="max-w-6xl mx-auto space-y-10 font-sans">
            {/* Top Greeting & Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2D4A3E] uppercase tracking-wider mb-1">
                        <Sparkles size={14} />
                        <span>Creator Studio</span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-zinc-900">
                        Welcome back, {authorName}!
                    </h1>
                    <p className="text-sm text-zinc-600 mt-1">
                        Here is an overview of your serials, readers, and recent activity.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/author-works/new"
                        className="inline-flex items-center gap-2 bg-[#2D4A3E] text-white px-5 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#233c32] hover:-translate-y-[1px] transition-all"
                    >
                        <Plus size={16} />
                        New Book
                    </Link>
                </div>
            </div>

            {/* At-a-Glance Metric Snapshot Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
                    <div className="flex items-center justify-between text-zinc-500 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Readers</span>
                        <div className="p-2 rounded-xl bg-[#2D4A3E]/10 text-[#2D4A3E]">
                            <Users size={15} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">0</div>
                    <p className="text-xs text-zinc-400 mt-1">Direct followers & subscribers</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
                    <div className="flex items-center justify-between text-zinc-500 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Chapter Reads</span>
                        <div className="p-2 rounded-xl bg-[#2D4A3E]/10 text-[#2D4A3E]">
                            <Eye size={15} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">0</div>
                    <p className="text-xs text-zinc-400 mt-1">Total page views across works</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
                    <div className="flex items-center justify-between text-zinc-500 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Active Works</span>
                        <div className="p-2 rounded-xl bg-[#2D4A3E]/10 text-[#2D4A3E]">
                            <BookOpen size={15} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">{totalBooks}</div>
                    <p className="text-xs text-zinc-400 mt-1">Published & draft serials</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
                    <div className="flex items-center justify-between text-zinc-500 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Beta Reader Notes</span>
                        <div className="p-2 rounded-xl bg-[#2D4A3E]/10 text-[#2D4A3E]">
                            <MessageSquare size={15} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">0</div>
                    <p className="text-xs text-zinc-400 mt-1">Unread feedback entries</p>
                </div>
            </div>

            {/* Main Content Area: Active Works & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Works Shelf Preview */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <h2 className="font-serif text-xl font-bold text-zinc-900">Your Active Serials</h2>
                        <Link href="/author-works" className="text-xs font-bold text-[#2D4A3E] hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={15} />
                        </Link>
                    </div>

                    {totalBooks === 0 ? (
                        /* Zero State for New Authors */
                        <div className="text-center py-12 px-4 rounded-2xl bg-[#EAE6DF]/40 border border-dashed border-[#2D4A3E]/20 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#2D4A3E]/10 text-[#2D4A3E] mx-auto flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="font-serif font-bold text-zinc-800 text-base">Your shelf is currently empty</h3>
                            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                                Create your first book manuscript or draft chapters to start sharing your story with readers.
                            </p>
                            <Link
                                href="/author-works/new"
                                className="inline-block mt-2 text-xs font-bold bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#233c32] transition-all"
                            >
                                Create First Book
                            </Link>
                        </div>
                    ) : (
                        <div className="text-xs text-zinc-500 py-6 text-center">
                            {/* We will render the active books list here next! */}
                            You have {totalBooks} book(s) on your shelf.
                        </div>
                    )}
                </div>

                {/* Recent Activity / Unread Comments Feed */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
                    <div className="border-b border-zinc-100 pb-4">
                        <h2 className="font-serif text-xl font-bold text-zinc-900">Recent Reader Activity</h2>
                    </div>

                    <div className="text-center py-10 text-xs text-zinc-400 space-y-2">
                        <MessageSquare size={24} className="mx-auto text-zinc-300" />
                        <p>No recent comments or beta feedback yet.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}