'use client'

import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import AppSidebar from './components/Sidebar'
import Header from './components/Header'
import ContentArea from './components/ContentArea'
import CreateBlogPost from './components/CreateBlogPost'

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
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)

      // Close sidebar on mobile when detecting screen size
      if (mobile && open) {
        setOpen(false)
      }
    }

    update()
    window.addEventListener("resize", update)

    // Set initialized after first render
    setIsInitialized(true)

    return () => window.removeEventListener("resize", update)
  }, [open, setOpen])

  // Initialize sidebar as closed on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
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

  const sidebarWidth = isMobile ? 0 : 288

  return (
    <div className="flex min-h-screen w-full relative">

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={toggleSidebar}
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

      {/* MAIN CONTENT */}
      <div
        className="flex flex-1 flex-col bg-white overflow-hidden"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
        }}
      >
        <div className="flex items-center border-b h-16 px-6 bg-white">
          <SidebarTrigger />
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto">
          {/* Content Area Section */}
          <ContentArea onNavigateToBlogPost={scrollToBlogPost} />

          {/* Blog Post Section - will be scrolled to when clicking Create Content */}
          <div ref={blogPostSectionRef}>
            <CreateBlogPost />
          </div>
        </main>
      </div>
    </div>
  )
}