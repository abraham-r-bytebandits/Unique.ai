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
        <div className="lg:w-[350px]">
            <p className="text-lg font-medium text-gray-800 mb-3 text-left lg:text-left">
                Select a Tone:
            </p>

            <div className="flex flex-col items-center gap-y-4">
                <div className="flex w-full justify-between">
                    {TONES.slice(0, 3).map((t) => {
                        const active = t === selectedTone
                        return (
                            <button
                                key={t}
                                onClick={() => toggleTone(t)}
                                className={`px-2 py-2 rounded-full text-[12px] font-medium transition-all min-w-[110px] text-center
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

                <div className="flex justify-center gap-x-6">
                    {TONES.slice(3, 5).map((t) => {
                        const active = t === selectedTone
                        return (
                            <button
                                key={t}
                                onClick={() => toggleTone(t)}
                                className={`px-2 py-2 rounded-full text-[12px] font-medium transition-all min-w-[130px] text-center ${active
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
                style={{ minHeight: '466px' }}
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

                <div className="p-6 h-[calc(360px-64px)] overflow-auto">
                    {!blogContent ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <div className="text-lg font-medium mb-2">Your generated blog will appear here</div>
                                <div className="text-sm">Click <span className="font-medium">Decode My DNA</span> to create a post based on your sample and tone.</div>
                            </div>
                        </div>
                    ) : (
                        <article className="prose prose-sm max-w-none">
                            {blogContent.split('\n').map((line, idx) => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    return <h3 key={idx} className="mt-0">{line.replace(/\*\*/g, '')}</h3>
                                }
                                return <p key={idx}>{line}</p>
                            })}
                        </article>
                    )}
                </div>
            </div>
        </div>
    )

    // Analysis Panel Component
    const AnalysisPanel = () => {
        if (!analysis) {
            return (
                <Card className="bg-gray-100 border-gray-200 hidden flex-shrink-0">
                    <CardContent className="p-6 flex items-center justify-center h-64">
                        <div className="text-center text-gray-400">
                            <div className="text-lg font-medium mb-2">Analysis Panel</div>
                            <div className="text-sm">Enter text and click "Decode My DNA" to see analysis results</div>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return (
            <div className="flex-shrink-0 p-4">
                <CardContent className="space-y-4">
                    <AnalysisRow icon="/tick.png" label="Tone" value={analysis.tone} />
                    <AnalysisRow icon="/tick.png" label="Emotion" value={analysis.emotion} />
                    <AnalysisRow icon="/tick.png" label="Confidence" value={`${analysis.confidence}%`} />
                    <AnalysisRow icon="/tick.png" label="Syntax" value={analysis.syntax} />
                    <AnalysisRow icon="/tick.png" label="Formality" value={analysis.formality} />

                    <div className="flex justify-between">
                        <div className="flex items-start gap-2">
                            <img src="/tick.png" alt="tick" className="w-5 h-5 mt-0.5" />
                            <span className="font-medium">Keywords</span>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <span className="text-muted-foreground">-</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <ul className="list-disc list-inside text-sm">
                                {analysis.keywords.map((keyword, idx) => (
                                    <li key={idx} className="text-muted-foreground">{keyword}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>

                <div className="p-[3px] rounded-xl bg-gradient-to-r from-[#0015FF] to-[#FF0000]">
                    <button
                        className="max-h-[57px] h-full w-full rounded-xl bg-gradient-to-r from-[#D0D3FF] to-[#FFDADA] text-[16px] lg:text-[20px] text-black font-medium px-6 py-3"
                        onClick={scrollToTitleInput}
                    >
                        Create Content
                    </button>
                </div>
            </div>
        )
    }

    // Analysis Row Component
    const AnalysisRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
                <img src={icon} alt="tick" className="w-5 h-5" />
                <span className="font-medium">{label}</span>
            </div>
            <div className="flex-1 flex justify-center">
                <span className="text-muted-foreground">-</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="font-semibold">{value}</span>
            </div>
        </div>
    )

    // Assistant Panel Component
    const AssistantPanel = () => {
        if (!isAssistantOpen) return null

        return (
            <div
                className="fixed inset-0 z-50 flex justify-end p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => setIsAssistantOpen(false)}
            >
                <div className="flex items-start" onClick={(e) => e.stopPropagation()}>
                    <span
                        className="text-black text-lg font-medium cursor-pointer mr-2 mt-4 hover:opacity-80 transition-opacity"
                        onClick={() => setIsAssistantOpen(false)}
                    >
                        &gt;&gt;
                    </span>

                    <div className="flex flex-col h-full">
                        <Card className="w-full md:max-w-[477px] lg:w-[477px] h-full overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b">
                                <div className="flex space-x-4">
                                    <CardTitle
                                        className={`cursor-pointer pb-2 ${activeTab === 'plagiarism' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                                        onClick={() => setActiveTab('plagiarism')}
                                    >
                                        Plagiarism Checker
                                    </CardTitle>
                                    <CardTitle
                                        className={`cursor-pointer pb-2 ${activeTab === 'humaniser' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                                        onClick={() => setActiveTab('humaniser')}
                                    >
                                        Humaniser
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-80px)] overflow-auto p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="flex justify-center items-center mb-6">
                                            <img src="/chat.png" alt="Assistant" className="w-32 h-32" />
                                        </div>

                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold mb-4">
                                                {activeTab === 'plagiarism' ? 'Nothing To Check Yet !' : 'Nothing To Check Yet !'}
                                            </h2>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                {activeTab === 'plagiarism'
                                                    ? 'Get Started by Generating something'
                                                    : 'Get Started by Generating something'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full max-w-md mx-auto mt-auto pt-6">
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm text-muted-foreground whitespace-nowrap">Waiting for words..</p>
                                            <div className="flex-1 border-b border-gray-300">
                                                <input
                                                    type="text"
                                                    className="w-full p-2 bg-transparent border-none focus:outline-none focus:ring-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="pt-6">
                            <div className="p-[3px] rounded-xl bg-gradient-to-r from-[#0015FF] to-[#FF0000] w-full">
                                <button className="max-h-[57px] h-full w-full rounded-xl bg-white text-[16px] lg:text-[20px] text-black font-medium px-6 py-3 text-center">
                                    Generate Content
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-white mt-10 text-gray-900 ${isAssistantOpen ? 'overflow-hidden' : ''}`}>
            <div className={`${isAssistantOpen ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}>
                <div className="flex min-h-screen">
                    <main className="flex-1 p-6 flex justify-center">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1300px] w-full">

                            {/* LEFT / MAIN (2 cols) */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <CardHeader className="flex flex-col gap-6">
                                        <div className="flex flex-col lg:flex-row w-full gap-6">
                                            {/* Blog Title Input */}
                                            <div className="flex-1">
                                                <CardTitle className="text-3xl">Create Your Blog Post</CardTitle>
                                                <h3 className="text-lg font-medium text-gray-800 mb-2 mt-6">
                                                    What should we call your Blog?
                                                </h3>
                                                <input
                                                    ref={blogTitleRef}
                                                    value={blogTitleInput}
                                                    onChange={(e) => setBlogTitleInput(e.target.value)}
                                                    placeholder="Enter Topic (e.g. The Future is Bytebandits)..."
                                                    className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-[#3964FE] text-base"
                                                />
                                            </div>

                                            {/* Tone Selector */}
                                            <ToneSelector />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#333333]">
                                            Provide a topic and adjust the tone. We'll generate an original, long-form blog post (800-2000 words) that perfectly matches your unique writing profile.
                                        </p>

                                        <BlogPostGenerator />

                                        <Button
                                            onClick={handleDecode}
                                            disabled={isProcessing}
                                            className="w-full max-w-[405px] bg-[#3964FE] py-6 text-lg"
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Processing...
                                                </div>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Decode My DNA
                                                    <img src="/star.png" alt="dna icon" className="w-5 h-5 object-contain" />
                                                </span>
                                            )}
                                        </Button>
                                    </CardContent>
                                </div>

                                <Card className="bg-[#D9D9D9] h-full max-h-[160px] hidden lg:block border-gray-200">
                                    <CardContent className="p-6">
                                        <div className="text-center text-gray-500"></div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* RIGHT SIDE: Output Box (1 col) */}
                            <div className="space-y-6">
                                <div className="space-y-6 flex flex-col">
                                    <Card
                                        className="border-border cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsAssistantOpen(true)}
                                    >
                                        <CardContent className="p-3 flex items-center justify-center">
                                            <span className="text-sm text-center font-medium">&lt;&lt; Open assistant</span>
                                        </CardContent>
                                    </Card>

                                    <AnalysisPanel />

                                    <Card className="bg-[#D9D9D9] border-gray-200 h-[160px] lg:h-dvh">
                                        <CardContent className="p-6 lg:h-full">
                                            <div className="text-center text-gray-500 h-full flex items-center justify-center"></div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <AssistantPanel />
        </div>
    )
}