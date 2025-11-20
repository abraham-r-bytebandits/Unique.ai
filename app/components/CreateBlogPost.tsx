'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'

interface AnalysisResult {
    title: string
    tone: string
    emotion: string
    confidence: number
    syntax: string
    formality: string
    keywords: string[]
}

const TONES = ['Happy', 'Sad', 'Energetic', 'Commercial', 'Informational'] as const
type Tone = (typeof TONES)[number]

// Add the props interface
interface CreateBlogPostProps {
    onNavigateToContent?: () => void
    onSectionChange?: () => void
}

export default function CreateBlogPost({ onNavigateToContent }: CreateBlogPostProps) {
    const blogTitleRef = useRef<HTMLInputElement | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [documentTitle, setDocumentTitle] = useState('Untitled document')
    const [isAssistantOpen, setIsAssistantOpen] = useState(false)
    const [selectedTone, setSelectedTone] = useState<Tone>('Informational')
    const [blogContent, setBlogContent] = useState<string>('')
    const [blogTitleInput, setBlogTitleInput] = useState<string>('')
    const [activeTab, setActiveTab] = useState('plagiarism')

    const scrollToTitleInput = () => {
        if (blogTitleRef.current) {
            blogTitleRef.current.focus();
            blogTitleRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    };

    // Add a back button handler
    const handleBackToContent = () => {
        if (onNavigateToContent) {
            onNavigateToContent()
        }
    }

    const analyzeText = (content: string): AnalysisResult => {
        // Simplified analysis logic
        return {
            title: 'Content',
            tone: 'Neutral',
            emotion: 'Calm',
            confidence: 75,
            syntax: 'Simple',
            formality: 'Neutral',
            keywords: ['sample', 'keywords']
        }
    }

    const generateBlogPost = (title: string, tone: Tone, sample: string) => {
        const heading = title || (analysis?.title ?? 'Your Topic')
        const intro = `**${heading}** — A ${tone.toLowerCase()} take on the subject.\n\n`
        const body = [
            `In today's world, ${heading.toLowerCase()} plays an important role. Based on what you wrote: ${sample.slice(0, 120)}...`,
            `The core ideas revolve around the main topic. We'll explore the background, the main problems and how to approach them.`,
            `Finally, we'll sum up with actionable steps you can take to apply these lessons in real life.`
        ].join('\n\n')

        const repeated = Array(Math.max(2, Math.floor(sample.length / 80))).fill(`${body}`).join('\n\n')
        return `${intro}${repeated}\n\n— End of generated article —`
    }

    const handleDecode = () => {
        setIsProcessing(true)

        setTimeout(() => {
            const result = analyzeText("sample text")
            setDocumentTitle(result.title)
            setAnalysis(result)

            const gen = generateBlogPost(blogTitleInput || result.title, selectedTone, "sample text")
            setBlogContent(gen)

            setIsProcessing(false)
        }, 1000)
    }

    const handleGenerate = () => {
        setIsProcessing(true)

        setTimeout(() => {
            const result = analyzeText("sample text")
            setDocumentTitle(result.title)
            setAnalysis(result)

            const gen = generateBlogPost(blogTitleInput || result.title, selectedTone, "sample text")
            setBlogContent(gen)

            setIsProcessing(false)
        }, 1000)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(blogContent)
        } catch (err) {
            alert('Unable to copy to clipboard')
        }
    }

    const handleSave = () => {
        const filename = `${(blogTitleInput || documentTitle || 'blog-post').replace(/\s+/g, '-').toLowerCase()}.txt`
        const blob = new Blob([blogContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const toggleTone = (t: Tone) => {
        setSelectedTone(t)
    }

    // Tone Selector Component
    const ToneSelector = () => (
        <div className="w-full lg:w-[350px]">
            <p className="text-lg font-medium text-gray-800 mb-3 text-center lg:text-left">
                Select a Tone:
            </p>

            <div className="flex flex-col items-center gap-y-4">
                <div className="flex flex-wrap justify-center gap-2 w-full">
                    {TONES.slice(0, 3).map((t) => {
                        const active = t === selectedTone
                        return (
                            <button
                                key={t}
                                onClick={() => toggleTone(t)}
                                className={`px-3 py-2 rounded-full text-[12px] font-medium transition-all min-w-[100px] md:min-w-[110px] text-center
                  ${active
                                        ? "bg-[#3964FE] text-white shadow-sm"
                                        : "bg-white text-gray-700 border border-gray-200"
                                    }
                `}
                            >
                                {t}
                            </button>
                        )
                    })}
                </div>

                <div className="flex flex-wrap justify-center gap-2 w-full">
                    {TONES.slice(3, 5).map((t) => {
                        const active = t === selectedTone
                        return (
                            <button
                                key={t}
                                onClick={() => toggleTone(t)}
                                className={`px-3 py-2 rounded-full text-[12px] font-medium transition-all min-w-[120px] md:min-w-[130px] text-center ${active
                                    ? "bg-[#3964FE] text-white shadow-sm"
                                    : "bg-white text-gray-700 border border-gray-200"
                                    }
                `}
                            >
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )

    // Blog Post Generator Component
    const BlogPostGenerator = () => (
        <div className="rounded-2xl p-1">
            <div
                className="bg-white rounded-2xl border border-gray-200 relative overflow-hidden
          ring-4 ring-[#3964FE]/30 shadow-[0_6px_0_rgba(57,100,254,0.06)]"
                style={{ minHeight: '514px' }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="text-sm text-gray-700"></div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCopy}
                            disabled={!blogContent}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm hover:shadow-sm disabled:opacity-50"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-80">
                                <rect x="9" y="9" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"></rect>
                                <rect x="4" y="5" width="11" height="7" rx="2" stroke="currentColor" strokeWidth="1.2"></rect>
                            </svg>
                            <span>Copy</span>
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!blogContent}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[#3964FE] text-white text-sm hover:shadow-md disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="p-6 h-[calc(360px-64px)] overflow-auto scroll-smooth">
                    {!blogContent ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <div className="text-lg font-medium mb-2">Your generated blog will appear here</div>
                                <div className="text-sm">Click <span className="font-medium">Generate</span> to create a post based on your topic and tone.</div>
                            </div>
                        </div>
                    ) : (
                        <article className="prose prose-sm max-w-none prose-headings:mt-0">
                            {blogContent.split('\n').map((line, idx) => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    return <h3 key={idx} className="text-[30px]">{line.replace(/\*\*/g, '')}</h3>
                                }
                                return <p key={idx}>{line}</p>
                            })}
                        </article>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div className={`min-h-screen bg-white text-gray-900 ${isAssistantOpen ? 'overflow-hidden' : ''}`}>
            <div className={`${isAssistantOpen ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}>
                <div className="flex min-h-screen">
                    <main className="flex-1 p-4 md:p-6 flex justify-center">
                        <div className="w-full max-w-[1300px]">
                            <div className="space-y-6">
                                <div>
                                    <CardHeader className="flex flex-col gap-6 px-0 lg:px-6">
                                        <div className="flex flex-col lg:flex-row w-full gap-6">
                                            {/* Blog Title Input */}
                                            <div className="flex-1">
                                                <CardTitle className="text-2xl md:text-3xl text-left">
                                                    Create Your Blog Post
                                                </CardTitle>

                                                {/* Heading Row */}
                                                <div className="flex items-center justify-between mb-2 mt-4 md:mt-6">
                                                    <h3 className="text-base md:text-lg font-medium text-gray-800 text-left">
                                                        What should we call your Blog?
                                                    </h3>
                                                </div>

                                                {/* Input + half-overlapping Button */}
                                                <div className="relative w-full mt-4">
                                                    <input
                                                        ref={blogTitleRef}
                                                        value={blogTitleInput}
                                                        onChange={(e) => setBlogTitleInput(e.target.value)}
                                                        placeholder="Enter Topic (e.g. The Future is Bytebandits)..."
                                                        className="w-full rounded-md border border-gray-300 px-4 py-3 pr-28 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#3964FE] text-base"
                                                    />

                                                    <button
                                                        onClick={handleGenerate}
                                                        disabled={isProcessing}
                                                        className="absolute right-2 -top-9 translate-y-1/2 
          inline-flex items-center gap-2 px-5 py-2 rounded-md 
          bg-[#3964FE] text-white text-sm hover:shadow-md disabled:opacity-50"
                                                    >
                                                        {isProcessing ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                Generating...
                                                            </div>
                                                        ) : (
                                                            <span>Generate</span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Tone Selector */}
                                            <ToneSelector />
                                        </div>

                                    </CardHeader>

                                    <CardContent className="space-y-6 px-0 lg:px-6">
                                        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#333333] text-center lg:text-left">
                                            Provide a topic and adjust the tone. We'll generate an original, long-form blog post (800-2000 words) that perfectly matches your unique writing profile.
                                        </p>

                                        <BlogPostGenerator />
                                    </CardContent>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}