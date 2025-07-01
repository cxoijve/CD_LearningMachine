"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Gift, Home, BarChart2, MessageSquare, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analyzeConversation } from "@/lib/analyze"
import type { AnalysisResult } from "@/lib/analyze"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { useAnalysis } from "@/context/analysis-context"

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const { fileId: contextFileId, setFileId } = useAnalysis()
  const fileId = searchParams.get('fileId') || contextFileId
  const { setAnalysisResult } = useAnalysis()
  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalysis() {
      if (!fileId) {
        setError('파일 ID가 없습니다.')
        setLoading(false)
        return
      }

      try {
        const results = await analyzeConversation(fileId)
        setAnalysisResultState(results.data)
        setAnalysisResult(results.data)
        setFileId(fileId)
      } catch (err) {
        console.error('Analysis error:', err)
        setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [fileId, setAnalysisResult, setFileId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">분석 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild className="bg-pink-500 text-white rounded-full px-8 py-4 text-lg font-bold shadow-md hover:bg-pink-600 transition-all duration-300 hover:scale-105">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!analysisResult) {
    return null
  }

  // keywords: 모든 AnalysisResult의 keywords를 평탄화하여 name별로 score를 합산
  const keywordMap: Record<string, number> = {}
  analysisResult.forEach(item => {
    item.keywords.forEach(kw => {
      if (keywordMap[kw.name]) {
        keywordMap[kw.name] += kw.score
      } else {
        keywordMap[kw.name] = kw.score
      }
    })
  })
  // 상위 5개만 추출
  const keywords = Object.entries(keywordMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // relationship: 날짜별로 intimacy를 모아 그래프 데이터 생성
  const relationship = analysisResult.map(item => ({
    date: item.date,
    intimacy: item.intimacy,
  }))

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-b from-white to-pink-50">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-500 drop-shadow-sm">카카오톡 대화 분석 결과</h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-xl mx-auto">대화 데이터를 기반으로 주요 키워드와 관계 친밀도를 분석해드립니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mb-8 px-4">
        {/* 키워드 분석 */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/90 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500 text-2xl">
              <MessageSquare className="h-6 w-6" />
              주요 키워드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={keywords}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 14 }} />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 14 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 관계 변화 추적 */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/90 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500 text-2xl">
              <Star className="h-6 w-6" />
              관계 친밀도 변화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={relationship}>
                  <defs>
                    <linearGradient id="colorIntimacy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 14 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#4b5563', fontSize: 14 }} ticks={[0,1,2,3,4,5]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="intimacy"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorIntimacy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild className="bg-pink-500 text-white rounded-full px-8 py-4 text-lg font-bold shadow-md hover:bg-pink-600 transition-all duration-300 hover:scale-105">
          <Link href={`/recommendations?fileId=${fileId}`}>선물 추천받기</Link>
        </Button>
      </div>
    </section>
  )
}
