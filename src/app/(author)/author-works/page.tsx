import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, BookOpen, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import WorksLibraryClient from './WorksLibraryClient'

export default async function AuthorWorksPage() {
    const supabase = await createClient()

    // 1. Secure Server Auth Check
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        redirect('/author-login')
    }

    // 2. Fetch User's Books from Supabase
    const { data: books } = await supabase
        .from('books')
        .select('*')
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false })

    const userBooks = books || []

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans">
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm relative z-10">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2D4A3E] uppercase tracking-wider mb-1">
                        <Layers size={14} />
                        <span>Library Control Center</span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-zinc-900">
                        My Works
                    </h1>
                    <p className="text-sm text-zinc-600 mt-1">
                        Manage your ongoing serials, drafts, and manuscript settings.
                    </p>
                </div>
                <div>
                    <Link
                        href="/author-works/new"
                        className="inline-flex items-center gap-2 bg-[#2D4A3E] text-white px-5 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#233c32] hover:-translate-y-[1px] transition-all"
                    >
                        <Plus size={16} />
                        Create New Book
                    </Link>
                </div>
            </div>

            {/* Render Client Library Component with Filter Tabs & View Toggle */}
            <WorksLibraryClient initialBooks={userBooks} />
        </div>
    )
}