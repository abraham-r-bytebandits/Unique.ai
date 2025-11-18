'use client'

import { useState, ChangeEvent, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface AnalysisResult {
  title: string
  tone: string
  emotion: string
  confidence: number
  syntax: string
  formality: string
  keywords: string[]
}

interface ContentAreaProps {
  onNavigateToBlogPost: () => void
}

export default function ContentArea({ onNavigateToBlogPost }: ContentAreaProps) {
  const [text, setText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [documentTitle, setDocumentTitle] = useState('Untitled document')
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('plagiarism')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const words = value.trim().split(/\s+/).filter(word => word.length > 0)
    const count = words.length

    if (count > 150) return

    setText(value)
    setWordCount(count)
  }

  const handleScrollToTop = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0
    }
  }

  const analyzeText = (content: string): AnalysisResult => {
    const words = content.toLowerCase().split(/\s+/)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)

    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'i', 'my', 'me', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'doing']

    const topicKeywords = {
      business: ['business', 'entrepreneur', 'startup', 'company', 'market'],
      content: ['content', 'writing', 'blog', 'article', 'post'],
      marketing: ['marketing', 'social', 'media', 'audience', 'brand'],
      tech: ['technology', 'software', 'digital', 'online', 'platform'],
      education: ['learning', 'education', 'course', 'teach', 'student'],
      health: ['health', 'wellness', 'fitness', 'medical', 'care'],
      travel: ['travel', 'journey', 'adventure', 'destination', 'trip'],
      food: ['food', 'recipe', 'cooking', 'restaurant', 'cuisine'],
      lifestyle: ['lifestyle', 'living', 'home', 'family', 'personal'],
      work: ['work', 'productivity', 'time', 'professional', 'career']
    }

    let detectedTopic = 'Content'
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => content.toLowerCase().includes(kw))) {
        detectedTopic = topic.charAt(0).toUpperCase() + topic.slice(1)
        break
      }
    }

    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'happy', 'perfect']
    const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'hate', 'poor', 'difficult', 'problem', 'issue', 'struggle']
    const urgentWords = ['urgent', 'immediately', 'asap', 'critical', 'important', 'crucial', 'vital']
    const formalWords = ['therefore', 'furthermore', 'moreover', 'consequently', 'nevertheless', 'however', 'thus']
    const assertiveWords = ['must', 'should', 'need', 'require', 'essential', 'necessary', 'important']
    const informalWords = ['gonna', 'wanna', 'yeah', 'cool', 'awesome', 'stuff', 'thing', 'things']

    const positiveCount = words.filter(w => positiveWords.includes(w)).length
    const negativeCount = words.filter(w => negativeWords.includes(w)).length
    const urgentCount = words.filter(w => urgentWords.includes(w)).length
    const formalCount = words.filter(w => formalWords.includes(w)).length
    const informalCount = words.filter(w => informalWords.includes(w)).length
    const assertiveCount = words.filter(w => assertiveWords.includes(w)).length

    let tone = 'Neutral'
    if (positiveCount > negativeCount + 2) tone = 'Positive'
    else if (negativeCount > positiveCount + 2) tone = 'Negative'
    else if (urgentCount > 1) tone = 'Urgent'
    else if (assertiveCount > 2) tone = 'Assertive'

    let emotion = 'Calm'
    if (content.includes('!') || urgentCount > 0) emotion = 'Excited'
    if (positiveCount > 3) emotion = 'Enthusiastic'
    if (negativeCount > 2) emotion = 'Concerned'
    if (assertiveCount > 2) emotion = 'Determined'

    const avgSentenceLength = words.length / sentences.length
    const confidenceScore = Math.min(95, 50 + (assertiveCount * 10) + (avgSentenceLength > 10 ? 15 : 0) + (positiveCount * 5))

    const avgWordsPerSentence = words.length / sentences.length
    let syntax = 'Simple'
    if (avgWordsPerSentence > 20) syntax = 'Complex'
    else if (avgWordsPerSentence > 12) syntax = 'Moderate'

    let formality = 'Neutral'
    if (formalCount > 2) formality = 'Formal'
    else if (informalCount > 2) formality = 'Informal'
    else if (content.includes('I ') || content.includes('my ')) formality = 'Conversational'

    const wordFreq: { [key: string]: number } = {}
    words.forEach(word => {
      if (word.length > 4 && !commonWords.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })

    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    return {
      title: detectedTopic,
      tone,
      emotion,
      confidence: Math.round(confidenceScore),
      syntax,
      formality,
      keywords
    }
  }

  const handleDecode = () => {
    if (!text.trim()) {
      alert('Please enter some text before decoding your DNA.')
      return
    }

    if (wordCount < 40) {
      alert('Please provide at least 40 words for better analysis.')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const result = analyzeText(text)
      setDocumentTitle(result.title)
      setAnalysis(result)
      setIsProcessing(false)
    }, 1500)
  }

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
            onClick={onNavigateToBlogPost}
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
    <div className={`min-h-screen bg-white text-gray-900 ${isAssistantOpen ? 'overflow-hidden' : ''}`}>
      <div className={`${isAssistantOpen ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}>
        <div className="flex min-h-screen">
          <main className="flex-1 p-6 flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full">

              {/* CENTER MAIN CONTENT */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <CardHeader>
                    <CardDescription className="text- font-bold text-[#737373]">{documentTitle}</CardDescription>
                    <CardTitle className="text-[20px] md:text-[30px] lg:text-[40px] xl:text-[50px] ">Create Authentic Content</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#333333]">
                      Paste a sample of your own writing{" "}
                      <span className="text-[#3964FE] font-medium">(minimum 40 words)</span>.<br />
                      The more you provide, the more accurately we can emulate your unique style.
                    </p>

                    <div className="relative space-y-4">

                      {/* Wrap the textarea in a relative container */}
                      <div className="relative">
                        <Textarea
                          placeholder="Start typing or paste your content here..."
                          value={text}
                          onChange={handleTextChange}
                          className="min-h-[200px] resize-none text-base p-4 pr-12"
                          ref={textareaRef}
                        />

                        {/* Up-arrow button INSIDE the textarea */}
                        <button
                          type="button"
                          aria-label="Scroll to top"
                          onClick={handleDecode}
                          className="
        absolute
        bottom-3
        right-3
        h-8
        w-8
        rounded-full
        flex
        items-center
        justify-center
        shadow-[0_6px_18px_rgba(57,100,254,0.22)]
        transition-transform
        hover:scale-105
        active:scale-95
      "
                          style={{ backgroundColor: "#3964FE", color: "#FFFFFF" }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className={`text-sm font-medium ${wordCount >= 40 && wordCount <= 150 ? "text-green-600" : "text-red-600"}`}>
                          {wordCount} / 150 words
                        </p>
                      </div>
                    </div>


                    <p className="text-sm text-[#737373]">
                      <span className='text-[#000000]'>Note:</span> Your writing sample is used solely to create your personal style profile.
                      We do not store or use it for any other purpose.
                    </p>

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

                <Card className="bg-[#D9D9D9] h-full max-h-[260px] hidden lg:block border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500"></div>
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT SIDEBAR */}
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

                <Card className="bg-[#D9D9D9] border-gray-200 h-full">
                  <CardContent className="p-6 h-full">
                    <div className="text-center text-gray-500 h-full flex items-center justify-center"></div>
                  </CardContent>
                </Card>

                <Card className="bg-[#D9D9D9] h-full max-h-[260px] block lg:hidden border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AssistantPanel />
    </div>
  )
}