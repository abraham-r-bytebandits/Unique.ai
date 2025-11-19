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
  onAnalysisComplete?: (analysis: AnalysisResult) => void
}

export default function ContentArea({
  onNavigateToBlogPost,
  onAnalysisComplete,
}: ContentAreaProps) {
  const [text, setText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('Untitled document')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const words = value.trim().split(/\s+/).filter(word => word.length > 0)
    const count = words.length

    if (count > 150) return

    setText(value)
    setWordCount(count)
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
      setIsProcessing(false)

      // Pass analysis data to parent
      if (onAnalysisComplete) {
        onAnalysisComplete(result)
      }
    }, 1500)
  }

  return (
    <div className="bg-white text-gray-900">
      <div className="flex lg:min-h-screen">
        <main className="flex-1 md:p-6 flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="space-y-6">
              <div>
                <CardHeader className='px-0 lg:px-6'>
                  <CardDescription className="text-sm md:text-base font-bold text-[#737373] text-left">{documentTitle}</CardDescription>
                  <CardTitle className="text-[24px] md:text-[30px] lg:text-[40px] xl:text-[50px] text-left">Create Authentic Content</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 px-0 lg:px-6">
                  <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#333333] text-left">
                    Paste a sample of your own writing{" "}
                    <span className="text-[#3964FE] font-medium">(minimum 40 words)</span>.<br className="hidden md:block" />
                    The more you provide, the more accurately we can emulate your unique style.
                  </p>

                  <div className="relative space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Start typing or paste your content here..."
                        value={text}
                        onChange={handleTextChange}
                        className="min-h-[200px] resize-none text-base p-4 pr-12"
                        ref={textareaRef}
                      />

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

                  <p className="text-sm text-[#737373] text-left">
                    <span className='text-[#000000]'>Note:</span> Your writing sample is used solely to create your personal style profile.
                    We do not store or use it for any other purpose.
                  </p>

                  <div className="flex justify-center lg:justify-start">
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
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}