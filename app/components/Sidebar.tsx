'use client'

import { User, PanelLeft } from "lucide-react"
import SidebarAddBox from "./SidebarAddBox"

interface AppSidebarProps {
  isOpen: boolean
  history: string[]
  onAddItem: (newItem: string) => void
  onDeleteHistory?: (index: number) => void
  onClearHistory?: () => void
  isMobile: boolean
  onToggle: () => void
  onOpenAssistant: (type: 'plagiarism' | 'humanizer') => void
  onNewChat: () => void
}

export default function AppSidebar({
  isOpen,
  history,
  onAddItem,
  onDeleteHistory,
  onClearHistory,
  isMobile,
  onToggle,
  onOpenAssistant,
  onNewChat,
}: AppSidebarProps) {

  const sidebarWidth = isMobile ? 256 : 288

  const handleProductClick = (label: string) => {
    console.log('Product clicked:', label)

    if (label === "Plagiarism Checker") {
      onOpenAssistant('plagiarism')
      if (isMobile) onToggle()
    }
    else if (label === "Humanizer") {
      onOpenAssistant('humanizer')
      if (isMobile) onToggle()
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Menu Button (visible only when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1A1F35] text-white hover:bg-[#2D3748] transition-colors shadow-lg xl:hidden"
          aria-label="Open Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile
            ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out"
            : "fixed"
          }
          h-screen

          /* Mobile, sm, md, lg → open/close */
          ${!isOpen ? "-translate-x-full" : "translate-x-0"}

          /* xl → always open */
          xl:translate-x-0

          bg-[#1A1F35]
          border-r border-[#2D3748]
        `}
        style={{ width: sidebarWidth }}
        aria-hidden={!isOpen}
      >

        <div className="flex flex-col w-full h-screen overflow-y-auto">

          {/* Header */}
          <div className="p-4 border-b border-[#2D3748]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center">
                  <img src="/logo.png" alt="logo" className="max-h-8 max-w-8" />
                </div>
                <span className="text-lg font-semibold text-white">Unicq.ai</span>
              </div>

              {/* Close Button */}
              <button
                onClick={onToggle}
                className="p-1.5 rounded-md text-white hover:bg-[#2D3748] transition-colors lg:hidden"
                aria-label="Close Sidebar"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-8">

              {/* Products Section */}
              <div className="space-y-4">
                <h3 className="px-3 text-sm font-medium text-[#A0AEC0]">Products</h3>

                <div className="space-y-1">
                  {/* Analyse Writing */}
                  <button
                    onClick={() => handleProductClick("Analyse Writing")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer w-full text-left min-h-[44px]"
                  >
                    <img src="/side1.png" className="h-[22px] w-[22px]" />
                    <span className="flex-1">Analyse Writing</span>
                  </button>

                  {/* Content Generator */}
                  <button
                    onClick={() => handleProductClick("Content Generator")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer w-full text-left min-h-[44px]"
                  >
                    <img src="/side2.png" className="h-[22px] w-[22px]" />
                    <span className="flex-1">Content Generator</span>
                  </button>

                  {/* Plagiarism Checker */}
                  <button
                    onClick={() => handleProductClick("Plagiarism Checker")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer w-full text-left min-h-[44px]"
                  >
                    <img src="/side3.png" className="h-[22px] w-[22px]" />
                    <span className="flex-1">Plagiarism Checker</span>
                  </button>

                  {/* Humanizer */}
                  <button
                    onClick={() => handleProductClick("Humanizer")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer w-full text-left min-h-[44px]"
                  >
                    <img src="/side4.png" className="h-[22px] w-[22px]" />
                    <span className="flex-1">Humanizer</span>
                  </button>
                </div>
              </div>

              <hr className="border border-[#394471]" />

              {/* Additional Menu Items */}
              <div className="space-y-1">
                {["How to Use", "Blogs", "FAQs", "Buy us a Coffee", "Contact Sales"].map((label, i) => (
                  <button
                    key={i}
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer w-full text-left min-h-[44px]"
                  >
                    <span className="flex-1">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#2D3748]">
            <div className="flex items-center justify-between px-2">
              {/* LEFT: User Info */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#2D3748] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#A0AEC0]" />
                </div>

                <span className="text-sm text-white">Hannah ...</span>
              </div>

              {/* RIGHT: Logout Button */}
              <button className="hover:opacity-80 transition">
                <img
                  src="/logout.png"
                  alt="logout"
                  className="h-5 w-5 object-contain"
                />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Buttons */}
      <SidebarAddBox
        onAdd={onAddItem}
        history={history}
        isMainSidebarOpen={isOpen}
        isMobile={isMobile}
        sidebarWidth={sidebarWidth}
        onToggleSidebar={onToggle}
        onNewChat={onNewChat}
        onDeleteHistory={onDeleteHistory}
        onClearHistory={onClearHistory}
      />
    </>
  )
}