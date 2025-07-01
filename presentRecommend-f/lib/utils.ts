import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GiftItem {
  id: string
  name: string
  price: string
  imageUrl: string
  description: string
  category: string
}

export interface RecommendationResult {
  date: string
  recommendations: GiftItem[]
}
