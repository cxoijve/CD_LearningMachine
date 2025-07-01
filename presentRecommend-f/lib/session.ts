// 세션 관리를 위한 유틸리티 함수
import { cookies } from "next/headers"
import type { AnalysisResult } from "./analyze"

// 세션에 분석 결과 저장
export async function saveAnalysisToSession(analysisResult: AnalysisResult[]): Promise<void> {
  const cookieStore = await cookies()
  await cookieStore.set("analysis", JSON.stringify(analysisResult), {
    maxAge: 60 * 60, // 1시간
    path: "/",
  })
}

// 세션에서 분석 결과 가져오기
export async function getAnalysisFromSession(): Promise<AnalysisResult[] | null> {
  const cookieStore = await cookies()
  const analysisCookie = cookieStore.get("analysis")

  if (!analysisCookie) {
    return null
  }

  try {
    return JSON.parse(analysisCookie.value) as AnalysisResult[]
  } catch (error) {
    console.error("Error parsing analysis from session:", error)
    return null
  }
}
