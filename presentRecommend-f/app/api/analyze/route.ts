import { type NextRequest, NextResponse } from "next/server"
import { analyzeConversation } from "@/lib/analyze"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Analyze the conversation
    const analysis = await analyzeConversation(text)

    return NextResponse.json(analysis, { status: 200 })
  } catch (error) {
    console.error("Error analyzing text:", error)
    return NextResponse.json({ error: "Failed to analyze the text" }, { status: 500 })
  }
}
