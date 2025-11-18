'use client'
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-around border-b border-border gap-14 bg-background md:px-6 w-full">
      {/* Left spacer for balance */}
      <div className="flex-1"></div>

      {/* Centered Title */}
      <div className="flex justify-center flex-1">
        <h1 className="text-[16px] lg:text-2xl text-nowrap font-semibold">Content Generator</h1>
      </div>

      {/* Right-aligned Buttons */}
      <div className="flex-1 flex justify-end items-center gap-2">
        <Button variant="ghost" className="text-sm hidden md:block">
          How to Use
        </Button>

        <Button variant="outline" className="text-sm bg-[#1A1F35] text-white px-4 rounded-[50px]">
          Log In / Sign up
        </Button>
      </div>
    </header>
  )
}