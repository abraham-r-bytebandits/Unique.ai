'use client'

import { User } from "lucide-react"
import SidebarAddBox from "./SidebarAddBox"

interface AppSidebarProps {
  isOpen: boolean
  history: string[]
  onAddItem: (newItem: string) => void
  isMobile: boolean
  onToggle: () => void
}

export default function AppSidebar({
  isOpen,
  history,
  onAddItem,
  isMobile,
  onToggle,
}: AppSidebarProps) {

  const sidebarWidth = isMobile ? 256 : 288

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

      {/* Custom Sidebar */}
      <div
        className={`
          ${isMobile
            ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out"
            : "fixed"
          }
          h-screen
          ${!isOpen ? "-translate-x-full" : "translate-x-0"}
          bg-[#1A1F35]
          border-r border-[#2D3748]
        `}
        style={{
          width: sidebarWidth,
        }}
        aria-hidden={!isOpen}
      >
        {/* Sidebar Content */}
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
              {isMobile && (
                <button
                  onClick={onToggle}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors text-white"
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-8">
              {/* Products Section */}
              <div className="space-y-4">
                <h3 className="px-3 text-sm font-medium text-[#A0AEC0]">
                  Products
                </h3>

                <div className="space-y-1">
                  {[
                    { src: "/side1.png", label: "Analyse Writing" },
                    { src: "/side2.png", label: "Content Generator" },
                    { src: "/side3.png", label: "Plagiarism Checker" },
                    { src: "/side4.png", label: "Humanizer" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer"
                    >
                      <img src={item.src} className="h-[22px] w-[22px]" alt={item.label} />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <hr className="border border-[#394471]" />

              {/* Additional Menu Items */}
              <div className="space-y-1">
                {["How to Use", "Blogs", "FAQs", "Buy us a Coffee", "Contact Sales"].map((label, i) => (
                  <a
                    key={i}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-[#2D3748] transition-colors cursor-pointer"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#2D3748]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#2D3748] flex items-center justify-center">
                <User className="h-4 w-4 text-[#A0AEC0]" />
              </div>
              <span className="text-sm text-white">Hannah ...</span>
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
      />
    </>
  )
}