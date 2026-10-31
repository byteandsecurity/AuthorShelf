'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    LayoutGrid,
    List,
    Clock,
    ChevronRight,
    ChevronLeft,
    BookOpen,
    Plus
} from 'lucide-react'

interface Book {
    id: string
    title: string
    synopsis: string | null
    genre: string | null
    status: 'draft' | 'beta' | 'published'
    updated_at: string
}

interface WorksLibraryClientProps {
    initialBooks: Book[]
}

const ITEMS_PER_PAGE = 20 // Capped books per page

export default function WorksLibraryClient({ initialBooks }: WorksLibraryClientProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'beta' | 'published'>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [currentPage, setCurrentPage] = useState(1)

    // Filter books based on active tab selection
    const filteredBooks = initialBooks.filter((book) => {
        if (activeTab === 'all') return true
        return book.status === activeTab
    })

    // Pagination calculations
    const totalItems = filteredBooks.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

    // Handle tab change and reset pagination to page 1
    const handleTabChange = (tab: 'all' | 'draft' | 'beta' | 'published') => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    if (initialBooks.length === 0) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-zinc-200/80 shadow-sm text-center max-w-2xl mx-auto space-y-4 my-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#EAE6DF] text-[#2D4A3E] mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-inner">
                    <BookOpen size={28} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-zinc-800">
                    Ready to put pen to paper?
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
                    You haven't initialized any books yet. Start a new manuscript today—you can refine the cover art and banner graphics later before publishing.
                </p>
                <div className="pt-2">
                    <Link
                        href="/author-works/new"
                        className="inline-flex items-center gap-2 bg-[#2D4A3E] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#233c32] transition-all"
                    >
                        <Plus size={18} />
                        Start Your First Book
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 relative z-10">
            {/* Filter Tabs & View Controls Bar */}
            <div className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Tabs: All, Draft, Beta, Published */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'draft', 'beta', 'published'] as const).map((tab) => {
                        const count = tab === 'all'
                            ? initialBooks.length
                            : initialBooks.filter(b => b.status === tab).length

                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all flex items-center gap-2 cursor-pointer ${
                                    activeTab === tab
                                        ? 'bg-[#2D4A3E] text-white shadow-sm'
                                        : 'text-zinc-600 hover:bg-zinc-100'
                                }`}
                            >
                                <span>{tab}</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                    activeTab === tab
                                        ? 'bg-white/20 text-white'
                                        : 'bg-zinc-200 text-zinc-700'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* View Mode Switcher: Grid vs List */}
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl self-end sm:self-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                            viewMode === 'grid'
                                ? 'bg-white text-[#2D4A3E] shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                        <LayoutGrid size={14} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        title="List View"
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                            viewMode === 'list'
                                ? 'bg-white text-[#2D4A3E] shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                        <List size={14} />
                    </button>
                </div>
            </div>

            {/* Empty State for Specific Filter */}
            {filteredBooks.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 text-center text-zinc-400 text-xs">
                    No books currently match the <strong className="capitalize">{activeTab}</strong> filter.
                </div>
            ) : viewMode === 'grid' ? (
                /* GRID / CARD VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedBooks.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-[6px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                        book.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : book.status === 'beta'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-zinc-100 text-zinc-600'
                                    }`}>
                                        {book.status}
                                    </span>
                                    {book.genre && (
                                        <span className="text-xs font-semibold text-zinc-400">
                                            {book.genre}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-zinc-900 line-clamp-1">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-zinc-500 mt-2 line-clamp-3 leading-relaxed">
                                    {book.synopsis || 'No synopsis added yet.'}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                                <div className="flex items-center gap-1">
                                    <Clock size={13} />
                                    <span>Updated {new Date(book.updated_at).toLocaleDateString('en-US', {
                                        month: 'numeric',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    </span>
                                </div>
                                <Link
                                    href={`/author-works/${book.id}`}
                                    className="font-bold text-[#2D4A3E] hover:underline flex items-center gap-1"
                                >
                                    Manage <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* LIST VIEW */
                <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden divide-y divide-zinc-100">
                    {paginatedBooks.map((book) => (
                        <div
                            key={book.id}
                            className="p-5 hover:bg-zinc-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-serif font-bold text-zinc-900 text-base">
                                        {book.title}
                                    </h3>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                        book.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : book.status === 'beta'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-zinc-100 text-zinc-600'
                                    }`}>
                                        {book.status}
                                    </span>
                                    {book.genre && (
                                        <span className="text-xs font-semibold text-zinc-400">
                                            • {book.genre}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500 line-clamp-1">
                                    {book.synopsis || 'No synopsis added yet.'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 text-xs shrink-0">
                                <div className="flex items-center gap-1 text-zinc-400">
                                    <Clock size={13} />
                                    <span>Updated {new Date(book.updated_at).toLocaleDateString('en-US', {
                                        month: 'numeric',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    </span>
                                </div>
                                <Link
                                    href={`/author-works/${book.id}`}
                                    className="inline-flex items-center gap-1 font-bold text-[#2D4A3E] hover:underline bg-[#2D4A3E]/10 px-3.5 py-2 rounded-full"
                                >
                                    Manage <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls Footer */}
            {totalItems > 0 && (
                <div className="bg-white px-6 py-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <div>
                        Showing <strong className="text-zinc-800">{startIndex + 1}</strong> to <strong className="text-zinc-800">{endIndex}</strong> of <strong className="text-zinc-800">{totalItems}</strong> book{totalItems !== 1 ? 's' : ''}
                        <span className="mx-2">•</span>
                        Page <strong className="text-zinc-800">{currentPage}</strong> of <strong className="text-zinc-800">{totalPages}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-semibold"
                        >
                            <ChevronLeft size={14} />
                            <span>Previous</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-semibold"
                        >
                            <span>Next</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}