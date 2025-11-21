'use client'

import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import AppSidebar from './components/Sidebar'
import ContentArea, { ContentAreaRef } from './components/ContentArea'
import CreateBlogPost, { CreateBlogPostRef } from './components/CreateBlogPost'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Header from './components/Header'
import GiftCoffee from './components/GiftCoffee'
import Faq from './components/Faq'

interface AnalysisResult {
  title: string
  tone: string
  emotion: string
  confidence: number
  syntax: string
  formality: string
  keywords: string[]
}

interface AssistantPanelProps {
  isAssistantOpen: boolean
  activeTab: 'plagiarism' | 'humanizer' | null
  onClose: () => void
  onTabChange: (tab: 'plagiarism' | 'humanizer') => void
}

// Local storage keys
const HISTORY_STORAGE_KEY = 'unicq-ai-history'
const MAX_HISTORY_ITEMS = 20

export default function Home() {
  const [history, setHistory] = useState<string[]>([])

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(Array.isArray(parsedHistory) ? parsedHistory : [])
      } catch (error) {
        console.error('Error parsing history from localStorage:', error)
        setHistory([])
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const handleAddItem = (newItem: string) => {
    if (!newItem.trim()) return

    setHistory(prev => {
      // Remove duplicates and keep only the latest occurrence
      const filtered = prev.filter(item => item !== newItem)
      // Add new item to the beginning and limit to max items
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      return updated
    })
  }

  const handleDeleteHistory = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index))
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  return (
    <SidebarProvider>
      <HomeContent
        history={history}
        onAddItem={handleAddItem}
        onDeleteHistory={handleDeleteHistory}
        onClearHistory={handleClearHistory}
      />
    </SidebarProvider>
  )
}

function HomeContent({
  history,
  onAddItem,
  onDeleteHistory,
  onClearHistory
}: {
  history: string[]
  onAddItem: (item: string) => void
  onDeleteHistory: (index: number) => void
  onClearHistory: () => void
}) {
  const { open, setOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  // Create separate refs for each component
  const blogPostSectionRef = useRef<HTMLDivElement>(null)
  const contentAreaRef = useRef<HTMLDivElement>(null)
  const giftCoffeeRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  // Refs for reset functionality
  const contentAreaComponentRef = useRef<ContentAreaRef>(null)
  const createBlogPostComponentRef = useRef<CreateBlogPostRef>(null)

  const prevIsMobileRef = useRef<boolean | null>(null)

  // State for Analysis Panel
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [currentSection, setCurrentSection] = useState('content')
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'plagiarism' | 'humanizer' | null>(null)

  const openAssistant = (tab: 'plagiarism' | 'humanizer') => {
    console.log('Opening assistant with tab:', tab);
    setActiveTab(tab)
    setIsAssistantOpen(true)
  }

  // Function to close assistant
  const closeAssistant = () => {
    setIsAssistantOpen(false)
    setActiveTab(null)
  }

  // Enhanced function to extract first two meaningful words
  const extractFirstTwoWords = (content: string): string => {
    if (!content.trim()) return ''

    // Remove markdown formatting, special characters, and extra whitespace
    const cleanContent = content
      .replace(/\*\*/g, '')           // Remove bold markers
      .replace(/#/g, '')              // Remove heading markers
      .replace(/[^\w\s]/g, ' ')       // Replace punctuation with spaces
      .replace(/\s+/g, ' ')           // Collapse multiple spaces
      .trim()
      .toLowerCase()

    // Common stop words to exclude
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'can', 'shall'
    ])

    // Split by whitespace and filter out stop words and empty strings
    const words = cleanContent
      .split(/\s+/)
      .filter(word => word.length > 0 && !stopWords.has(word))

    // Take first two meaningful words
    if (words.length >= 2) {
      // Capitalize first letter of each word
      const capitalizedWords = words.slice(0, 2).map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      return capitalizedWords.join(' ') + '…'
    } else if (words.length === 1) {
      const capitalizedWord = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      return capitalizedWord + '…'
    }

    // Fallback: if no meaningful words found, use first two actual words
    const fallbackWords = cleanContent.split(/\s+/).filter(word => word.length > 0)
    if (fallbackWords.length >= 2) {
      const capitalizedWords = fallbackWords.slice(0, 2).map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      return capitalizedWords.join(' ') + '…'
    } else if (fallbackWords.length === 1) {
      const capitalizedWord = fallbackWords[0].charAt(0).toUpperCase() + fallbackWords[0].slice(1)
      return capitalizedWord + '…'
    }

    return 'New Post…'
  }

  // Function to handle new chat
  const handleNewChat = () => {
    console.log('Starting new chat...');

    // Reset analysis data
    setAnalysis(null);

    // Reset content area
    if (contentAreaComponentRef.current) {
      contentAreaComponentRef.current.resetContent();
    }

    // Reset blog post
    if (createBlogPostComponentRef.current) {
      createBlogPostComponentRef.current.resetContent();
    }

    // Scroll to content area to start fresh
    scrollToContent();
  }

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 1024)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const prev = prevIsMobileRef.current
    if (prev === false && isMobile === true) {
      setOpen(false)
    }
    prevIsMobileRef.current = isMobile
  }, [isMobile, setOpen])

  const toggleSidebar = () => setOpen(!open)

  // Updated scrollToBlogPost to only target the blog post
  const scrollToBlogPost = () => {
    if (blogPostSectionRef.current) {
      blogPostSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      setCurrentSection('blog')
    }
  }

  const scrollToContent = () => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      setCurrentSection('content')
    }
  }

  // Function to handle analysis completion from ContentArea
  const handleAnalysisComplete = (analysisData: AnalysisResult) => {
    console.log('Analysis complete:', analysisData);
    setAnalysis(analysisData)
  }

  // Assistant Panel Component
  const AssistantPanel = ({
    isAssistantOpen,
    activeTab,
    onClose,
    onTabChange
  }: AssistantPanelProps) => {
    if (!isAssistantOpen || !activeTab) return null

    return (
      <div
        className="fixed inset-0 z-50 flex justify-end p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex items-start" onClick={(e) => e.stopPropagation()}>
          <span
            className="text-black text-lg font-medium cursor-pointer mr-2 mt-4 hover:opacity-80 transition-opacity"
            onClick={onClose}
          >
            &gt;&gt;
          </span>

          <div className="flex flex-col h-full">
            <Card className="w-full md:max-w-[477px] lg:w-[477px] h-full overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex space-x-4">
                  <div
                    className={`cursor-pointer pb-2 ${activeTab === 'plagiarism' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'} font-medium`}
                    onClick={() => onTabChange('plagiarism')}
                  >
                    Plagiarism Checker
                  </div>
                  <div
                    className={`cursor-pointer pb-2 ${activeTab === 'humanizer' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'} font-medium`}
                    onClick={() => onTabChange('humanizer')}
                  >
                    Humanizer
                  </div>
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

  // Analysis Panel Component
  const AnalysisPanel = () => {
    if (!analysis) {
      return (
        <Card className="bg-gray-100 border-gray-200">
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
      <div className="border-border">
        <CardHeader className="pb-3">
        </CardHeader>
        <CardContent className="space-y-4">
          <AnalysisRow icon="/tick.png" label="Tone" value={analysis.tone} />
          <AnalysisRow icon="/tick.png" label="Emotion" value={analysis.emotion} />
          <AnalysisRow icon="/tick.png" label="Confidence" value={`${analysis.confidence}%`} />
          <AnalysisRow icon="/tick.png" label="Syntax" value={analysis.syntax} />
          <AnalysisRow icon="/tick.png" label="Formality" value={analysis.formality} />

          {/* Keywords Section */}
          <div className="flex items-start justify-between pt-2">
            <div className="flex items-start gap-2 flex-1">
              <img src="/tick.png" alt="keywords" className="w-5 h-5 mt-0.5" />
              <span className="font-medium">Keywords</span>
            </div>
            <div className="flex-1 flex justify-center">
              <span className="text-muted-foreground">-</span>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="text-right">
                {analysis.keywords.map((keyword: string, idx: number) => (
                  <div key={idx} className="text-sm font-semibold text-gray-700">
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create Content Button */}
          <div className="pt-4">
            <div className="p-[3px] rounded-xl bg-gradient-to-r from-[#0015FF] to-[#FF0000]">
              <button
                className="max-h-[57px] h-full w-full rounded-xl bg-gradient-to-r from-[#D0D3FF] to-[#FFDADA] text-[16px] lg:text-[20px] text-black font-medium px-6 py-3 hover:opacity-90 transition-opacity"
                onClick={scrollToBlogPost}
              >
                Create Content
              </button>
            </div>
          </div>
        </CardContent>
      </div>
    )
  }

  // Right Sidebar Components - Conditionally rendered - UPDATED
  const RightSidebar = () => {
    return (
      <aside className="lg:flex flex-col space-y-6 min-h-0 hidden">
        {/* Assistant Opener Card & Analysis Panel - Only shows in content section */}
        {currentSection === 'content' && (
          <>
            <Card
              className="border-border cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                console.log('Opening assistant from right sidebar');
                setIsAssistantOpen(true);
                setActiveTab('plagiarism');
              }}
            >
              <CardContent className="p-3 flex items-center justify-center">
                <span className="text-sm text-center font-medium">&lt;&lt; Open assistant</span>
              </CardContent>
            </Card>

            {/* Analysis Panel - Show when analysis data exists */}
            {analysis && <AnalysisPanel />}
          </>
        )}

        {/* Empty Container Card - AT THE BOTTOM - ALWAYS SHOWS */}
        <Card className="bg-[#D9D9D9] border-gray-200 flex-1 min-h-0">
          <CardContent className="p-6 h-full">
            <div className="text-center text-gray-500 h-full flex items-center justify-center">
              {/* Right sidebar content */}
            </div>
          </CardContent>
        </Card>
      </aside>
    )
  }

  // Mobile Right Sidebar Components - Conditionally rendered - UPDATED
  const MobileRightSidebar = () => {
    // Only show when we're in the content section
    if (currentSection !== 'content') {
      return null
    }

    return (
      <div className='lg:hidden'>
        {/* Assistant Opener Card - AT THE TOP */}
        <Card
          className="border-border cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => {
            console.log('Opening assistant from mobile sidebar');
            setIsAssistantOpen(true);
            setActiveTab('plagiarism');
          }}
        >
          <CardContent className="p-3 flex items-center justify-center">
            <span className="text-sm text-center font-medium">&lt;&lt; Open assistant</span>
          </CardContent>
        </Card>

        {/* Analysis Panel - BELOW THE ASSISTANT OPENER - Show when analysis data exists */}
        {analysis && <AnalysisPanel />}
      </div>
    )
  }

  return (
    <div className="flex lg:h-screen w-full overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <AppSidebar
        isOpen={open}
        history={history}
        onAddItem={onAddItem}
        onDeleteHistory={onDeleteHistory}
        onClearHistory={onClearHistory}
        isMobile={isMobile}
        onToggle={toggleSidebar}
        onOpenAssistant={openAssistant}
        onNewChat={handleNewChat}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${open && !isMobile ? "lg:ml-64" : "lg:ml-0"
          } overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        {/* HEADER */}
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] flex-1 gap-6 p-6 overflow-hidden">

          {/* MAIN CONTENT COLUMN */}
          <div className="flex flex-col min-h-0">

            {/* Scrollable content area */}
            <div
              className="flex-1 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onScroll={(e) => {
                const scrollContainer = e.currentTarget
                const contentArea = contentAreaRef.current
                const blogPost = blogPostSectionRef.current

                if (contentArea && blogPost) {
                  const contentAreaRect = contentArea.getBoundingClientRect()
                  const blogPostRect = blogPost.getBoundingClientRect()

                  const isContentAreaVisible =
                    contentAreaRect.top >= 0 &&
                    contentAreaRect.top < window.innerHeight

                  const isBlogPostVisible =
                    blogPostRect.top < window.innerHeight * 0.8

                  setCurrentSection(
                    isContentAreaVisible && !isBlogPostVisible
                      ? "content"
                      : "blog"
                  )
                }
              }}
            >
              {/* Content Writing Area */}
              <div ref={contentAreaRef}>
                <ContentArea
                  ref={contentAreaComponentRef}
                  onNavigateToBlogPost={scrollToBlogPost}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </div>

              {/* Mobile Right Sidebar */}
              <MobileRightSidebar />

              {/* BOTTOM CARD — MOBILE */}
              <Card className="bg-[#D9D9D9] h-[160px] block lg:hidden border-gray-200 mt-6">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500"></div>
                </CardContent>
              </Card>

              {/* Blog Post Section */}
              <div ref={blogPostSectionRef}>
                <CreateBlogPost
                  ref={createBlogPostComponentRef}
                  onNavigateToContent={scrollToContent}
                  onSectionChange={() => setCurrentSection("blog")}
                  onAddToHistory={onAddItem}
                />
              </div>

              {/* Gift Coffee Section */}
              <div ref={giftCoffeeRef}>
                <GiftCoffee
                  onNavigateToContent={scrollToContent}
                  onSectionChange={() => setCurrentSection("blog")}
                />
              </div>

              {/* FAQ Section */}
              <div ref={faqRef}>
                <Faq
                  onNavigateToContent={scrollToContent}
                  onSectionChange={() => setCurrentSection("blog")}
                />
              </div>
            </div>

            {/* BOTTOM CARD — DESKTOP */}
            <div className="mt-6 ml-8 hidden lg:block">
              <Card className="bg-[#D9D9D9] h-[149px] border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    {/* Desktop bottom card content */}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* BOTTOM CARD — MOBILE */}
            <Card className="bg-[#D9D9D9] h-[160px] block lg:hidden border-gray-200 mt-6">
              <CardContent className="p-6">
                <div className="text-center text-gray-500"></div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <RightSidebar />

        </div>
      </div>

      {/* Assistant Panel */}
      <AssistantPanel
        isAssistantOpen={isAssistantOpen}
        activeTab={activeTab}
        onClose={closeAssistant}
        onTabChange={setActiveTab}
      />
    </div>
  )
}