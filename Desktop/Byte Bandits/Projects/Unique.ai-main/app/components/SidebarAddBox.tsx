'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PanelLeft, Plus, Clock, X } from 'lucide-react'

interface SidebarAddBoxProps {
    onAdd: (val: string) => void
    history: string[]
    isMainSidebarOpen: boolean
    isMobile?: boolean
    sidebarWidth: number
    onToggleSidebar: () => void
}

const GAP = -10
const BUTTON_BOX = 48
const HISTORY_WIDTH = 240

export default function SidebarAddBox({
    onAdd,
    history,
    isMainSidebarOpen,
    isMobile = false,
    sidebarWidth,
    onToggleSidebar
}: SidebarAddBoxProps) {

    const [openHistory, setOpenHistory] = useState(false)
    const [value, setValue] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (openHistory) {
            const t = setTimeout(() => inputRef.current?.focus(), 120)
            return () => clearTimeout(t)
        }
    }, [openHistory])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openHistory &&
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)) {
                setOpenHistory(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openHistory])

    const handleSubmit = () => {
        if (!value.trim()) return
        onAdd(value.trim())
        setValue('')
        setOpenHistory(false)
    }

    const handleToggleMainSidebar = (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggleSidebar()
    }

    const floatingStyle: React.CSSProperties = {
        left: isMainSidebarOpen
            ? `${sidebarWidth + GAP}px`
            : `${GAP}px`,
    }

    const panelStyle: React.CSSProperties = {
        left: isMainSidebarOpen
            ? `${sidebarWidth}px`
            : `0px`,
        width: `${HISTORY_WIDTH}px`,
    }

    return (
        <>
            {/* Floating Buttons */}
            <div
                className="fixed top-1/4 z-10 transition-all duration-300"
                style={{
                    transform: 'translateY(-50%)',
                    ...floatingStyle
                }}
            >
                <div
                    className="flex flex-col gap-3 bg-white border p-3 rounded-xl shadow-xl items-center"
                    style={{ width: BUTTON_BOX, height: 110 }}
                >
                    <button
                        onClick={handleToggleMainSidebar}
                        className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200"
                    >
                        <PanelLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => setOpenHistory(true)}
                        className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Sliding History Drawer */}
            <div
                ref={panelRef}
                className="fixed top-[25%] h-screen z-50 transition-all duration-300 bg-white"
                style={{
                    ...(isMobile
                        ? { width: "100vw", left: 0 }
                        : panelStyle),
                    transform: openHistory
                        ? "translateX(0)"
                        : "translateX(-100%)",
                    opacity: openHistory ? 1 : 0,
                }}
            >
                <div className="h-full bg-white border-r shadow-2xl flex flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-sm font-semibold">History</h3>
                        <button
                            onClick={() => setOpenHistory(false)}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Saved Items */}
                    <div className="flex-1 p-2 overflow-y-auto">
                        {history.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No history yet</p>
                        ) : (
                            history.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        setValue(item)
                                        inputRef.current?.focus()
                                    }}
                                >
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm truncate">{item}</span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Box */}
                    <div className="p-4 border-t">
                        <p className="text-sm mb-2 font-medium">Add New Item</p>
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter item..."
                            />
                        </div>
                    </div>

                </div>
            </div>


            {/* Overlay for history on mobile */}
            {isMobile && openHistory && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setOpenHistory(false)}
                />
            )}
        </>
    )
}
