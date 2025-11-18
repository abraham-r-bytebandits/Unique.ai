'use client'

import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import AppSidebar from './components/Sidebar'
import ContentArea from './components/ContentArea'
import CreateBlogPost from './components/CreateBlogPost'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Header from './components/Header' // Import the Header component

interface AnalysisResult {
  title: string
  tone: string
  emotion: string
  confidence: number
  syntax: string
  formality: string
  keywords: string[]
}

export default function Home() {
  const [history, setHistory] = useState(["Solopre…", "Byteband…", "History 1…"])

  const handleAddItem = (newItem: string) => {
    if (!newItem.trim()) return
    setHistory(prev => [newItem, ...prev])
  }

  return (
    <SidebarProvider>
      <HomeContent history={history} onAddItem={handleAddItem} />
    </SidebarProvider>
  )
}

function HomeContent({ history, onAddItem }: any) {
  const { open, setOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const blogPostSectionRef = useRef<HTMLDivElement>(null)
  const prevIsMobileRef = useRef<boolean | null>(null)

  // State for Analysis Panel
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('plagiarism')

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

  const scrollToBlogPost = () => {
    if (blogPostSectionRef.current) {
      blogPostSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Function to handle analysis completion from ContentArea
  const handleAnalysisComplete = (analysisData: AnalysisResult) => {
    setAnalysis(analysisData)
  }

  // Analysis Panel Component
  const AnalysisPanel = () => {
    if (!analysis) {
      return (
        <Card className="bg-gray-100 border-gray-200 hidden">
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
      <div>
        <CardContent className="space-y-4 p-6">
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
                {analysis.keywords.map((keyword: string, idx: number) => (
                  <li key={idx} className="text-muted-foreground">{keyword}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4">
            <div className="p-[3px] rounded-xl bg-gradient-to-r from-[#0015FF] to-[#FF0000]">
              <button
                className="max-h-[57px] h-full w-full rounded-xl bg-gradient-to-r from-[#D0D3FF] to-[#FFDADA] text-[16px] lg:text-[20px] text-black font-medium px-6 py-3"
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
                  <div
                    className={`cursor-pointer pb-2 ${activeTab === 'plagiarism' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'} font-medium`}
                    onClick={() => setActiveTab('plagiarism')}
                  >
                    Plagiarism Checker
                  </div>
                  <div
                    className={`cursor-pointer pb-2 ${activeTab === 'humaniser' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'} font-medium`}
                    onClick={() => setActiveTab('humaniser')}
                  >
                    Humaniser
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
        isMobile={isMobile}
        onToggle={toggleSidebar}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${open && !isMobile ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
        {/* HEADER */}
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] flex-1 gap-6 p-6 overflow-hidden">

          {/* MAIN CONTENT COLUMN */}
          <div className="flex flex-col min-h-0">
            {/* Scrollable content area */}
            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Content Writing Area */}
              <ContentArea
                onNavigateToBlogPost={scrollToBlogPost}
                onAnalysisComplete={handleAnalysisComplete}
              />

              <div className='lg:hidden'>
                {/* Assistant Opener Card - AT THE TOP */}
                <Card
                  className="border-border cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setIsAssistantOpen(true)}
                >
                  <CardContent className="p-3 flex items-center justify-center">
                    <span className="text-sm text-center font-medium">&lt;&lt; Open assistant</span>
                  </CardContent>
                </Card>

                {/* Analysis Panel - BELOW THE ASSISTANT OPENER */}
                <AnalysisPanel />

                {/* Empty Container Card - AT THE BOTTOM */}
                <Card className="bg-[#D9D9D9] border-gray-200 h-[160px] flex-1 min-h-0">
                  <CardContent className="p-6 h-full">
                    <div className="text-center text-gray-500 h-full flex items-center justify-center">
                      {/* Right sidebar content */}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Blog Post Section */}
              <div ref={blogPostSectionRef}>
                <CreateBlogPost />
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
          <aside className="lg:flex flex-col space-y-6 min-h-0 hidden">
            {/* Assistant Opener Card - AT THE TOP */}
            <Card
              className="border-border cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsAssistantOpen(true)}
            >
              <CardContent className="p-3 flex items-center justify-center">
                <span className="text-sm text-center font-medium">&lt;&lt; Open assistant</span>
              </CardContent>
            </Card>

            {/* Analysis Panel - BELOW THE ASSISTANT OPENER */}
            <AnalysisPanel />

            {/* Empty Container Card - AT THE BOTTOM */}
            <Card className="bg-[#D9D9D9] border-gray-200 flex-1 min-h-0">
              <CardContent className="p-6 h-full">
                <div className="text-center text-gray-500 h-full flex items-center justify-center">
                  {/* Right sidebar content */}
                </div>
              </CardContent>
            </Card>
          </aside>

        </div>
      </div>

      {/* Assistant Panel Overlay */}
      <AssistantPanel />
    </div>
  )
}