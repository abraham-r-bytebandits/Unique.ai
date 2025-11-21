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
    onNewChat: () => void
    onDeleteHistory?: (index: number) => void
    onClearHistory?: () => void
}

const GAP = 2
const BUTTON_BOX = 40
const HISTORY_WIDTH = 240

export default function SidebarAddBox({
    onAdd,
    history,
    isMainSidebarOpen,
    isMobile = false,
    sidebarWidth,
    onToggleSidebar,
    onNewChat,
    onDeleteHistory,
    onClearHistory
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

    const handleNewChat = () => {
        onNewChat()
        setOpenHistory(false)
    }

    const handleDeleteItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDeleteHistory) {
            onDeleteHistory(index)
        }
    }

    const handleClearAll = () => {
        if (onClearHistory) {
            onClearHistory()
        }
    }

    const floatingStyle: React.CSSProperties = {
        left: openHistory
            ? `${sidebarWidth + HISTORY_WIDTH + GAP}px`
            : isMainSidebarOpen
                ? `${sidebarWidth + GAP}px`
                : `${GAP}px`,
    }

    const panelStyle: React.CSSProperties = {
        left: `${sidebarWidth}px`,
        width: `${HISTORY_WIDTH}px`,
    }

    return (
        <>
            {/* Floating Buttons - Higher z-index to stay above blur */}
            <div
                className="fixed top-[14%] z-50 transition-all duration-300"
                style={{
                    transform: 'translateY(-50%)',
                    ...floatingStyle
                }}
            >
                <div
                    className="flex flex-col gap-1 bg-white border p-2 rounded-xl shadow-xl items-center"
                    style={{ width: BUTTON_BOX, height: 90 }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpenHistory(true)
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <PanelLeft className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleNewChat}
                        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        aria-label="New chat"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Blur Overlay for Desktop - Only covers main content area */}
            {!isMobile && openHistory && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-40"
                    style={{
                        // Exclude sidebar area from the blur overlay
                        left: `${sidebarWidth}px`,
                    }}
                    onClick={() => setOpenHistory(false)}
                />
            )}

            {/* Sliding History Drawer - Higher z-index */}
            <div
                ref={panelRef}
                className="fixed top-[10%] h-screen z-50 transition-all duration-300"
                style={{
                    ...(isMobile
                        ? { width: "100vw", left: 0 }
                        : panelStyle),
                    transform: openHistory
                        ? "translateX(0)"
                        : "translateX(-100%)",
                    opacity: openHistory ? 1 : 0,
                    pointerEvents: openHistory ? 'auto' : 'none',
                }}
            >
                <div className="h-full bg-black bg-opacity-10 shadow-2xl flex flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-sm text-[#000000] font-semibold">History</h3>
                        {history.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Saved Items */}
                    <div className="flex-1 p-2 overflow-y-auto">
                        {history.length === 0 ? (
                            <p className="text-sm text-[#000000] text-center py-4">No history yet</p>
                        ) : (
                            history.map((item, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors min-h-[44px]"
                                    onClick={() => {
                                        setValue(item)
                                        inputRef.current?.focus()
                                    }}
                                >
                                    <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-sm truncate flex-1">{item}</span>
                                    <button
                                        onClick={(e) => handleDeleteItem(i, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all duration-200 flex items-center justify-center w-6 h-6"
                                        title="Delete this item"
                                    >
                                        <X className="h-3 w-3 text-red-500" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for history on mobile */}
            {isMobile && openHistory && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                    onClick={() => setOpenHistory(false)}
                />
            )}
        </>
    )
}