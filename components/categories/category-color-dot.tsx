"use client"

import { cn } from "@/lib/utils"

interface CategoryColorDotProps {
  color: string
  className?: string
}

const colorMap: Record<string, string> = {
  "#3b82f6": "bg-blue-500",
  "#10b981": "bg-emerald-500", 
  "#8b5cf6": "bg-violet-500",
  "#f59e0b": "bg-amber-500",
  "#ef4444": "bg-red-500",
  "#ec4899": "bg-pink-500",
  "#6366f1": "bg-indigo-500",
  "#14b8a6": "bg-teal-500",
  "#eab308": "bg-yellow-500",
  "#06b6d4": "bg-cyan-500",
  "#059669": "bg-emerald-600",
  "#f43f5e": "bg-rose-500",
}

export function CategoryColorDot({ color, className }: CategoryColorDotProps) {
  const bgClass = colorMap[color] || "bg-gray-500"
  
  return (
    <div 
      className={cn("w-4 h-4 rounded-full shrink-0", bgClass, className)}
      title={`Category color: ${color}`}
    />
  )
}
