'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Info, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewBookPage() {
    const router = useRouter()
    const supabase = createClient()

    const [title, setTitle] = useState('')
    const [genre, setGenre] = useState('Fantasy')
    const [synopsis, setSynopsis] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const genres = [
        'Fantasy',
        'Sci-Fi',
        'Romance',
        'Mystery / Thriller',
        'LitRPG / Progression',
        'Slice of Life',
        'Horror',
        'Non-Fiction',
        'Other'
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        setError(null)

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error('User session not found.')

            const { data, error: insertError } = await supabase
                .from('books')
                .insert({
                    author_id: user.id,
                    title: title.trim(),
                    genre,
                    synopsis: synopsis.trim() || null,
                    status: 'draft'
                })
                .select()
                .single()

            if (insertError) throw insertError

            // Redirect directly to the newly created book's manager/chapter page
            router.push(`/author-works/${data.id}`)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to create book. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 font-sans">
            {/* Back Button */}
            <Link
                href="/author-works"
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-[#2D4A3E] transition-colors"
            >
                <ArrowLeft size={14} />
                Back to My Works
            </Link>

            {/* Form Container */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
                <div className="border-b border-zinc-100 pb-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2D4A3E] uppercase tracking-wider mb-1">
                        <Sparkles size={14} />
                        <span>Initialization</span>
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-zinc-900">
                        Start a New Book
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Set up the core details of your manuscript. You can jump straight into writing chapters immediately.
                    </p>
                </div>

                {/* Optional Banner Notice Badge */}
                <div className="flex items-start gap-3 bg-[#EAE6DF]/50 border border-[#2D4A3E]/15 rounded-2xl p-4 text-xs text-zinc-700">
                    <Info size={18} className="text-[#2D4A3E] shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-[#2D4A3E]">Don't have cover art or banners ready yet?</span>
                        <p className="mt-0.5 text-zinc-600 leading-relaxed">
                            No worries! Visual assets like cover art and header banners can be added later whenever you decide to launch a Beta reader test or publish publicly.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                            Book Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., The Tapestry of Roan"
                            className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-[#2D4A3E] focus:bg-white transition-all font-medium"
                        />
                    </div>

                    {/* Genre Selection */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                            Primary Genre
                        </label>
                        <select
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-[#2D4A3E] focus:bg-white transition-all font-medium"
                        >
                            {genres.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Synopsis Input */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                            Logline / Brief Synopsis
                        </label>
                        <textarea
                            rows={4}
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                            placeholder="A brief summary or pitch of your story for readers..."
                            className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-[#2D4A3E] focus:bg-white transition-all font-medium leading-relaxed resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="w-full bg-[#2D4A3E] text-white py-4 rounded-full font-bold text-sm shadow-md hover:bg-[#233c32] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Initializing Book...' : 'Create Book & Start Writing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}