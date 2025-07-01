"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gift, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { uploadFile } from "@/lib/analyze"
import { useAnalysis } from "@/context/analysis-context"

function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { setFileId } = useAnalysis()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError("")

    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB를 초과할 수 없습니다.")
        return
      }

      if (!selectedFile.name.endsWith(".txt")) {
        setError("카카오톡 대화 텍스트 파일(.txt)만 업로드 가능합니다.")
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("파일을 선택해주세요.")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const result = await uploadFile(file)
      setFileId(result.data.fileId)
      router.push(`/analysis?fileId=${result.data.fileId}`)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : "파일 업로드 중 오류가 발생했습니다.")
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-pink-100 mb-2 shadow-md">
        <Gift className="w-12 h-12 text-pink-400" />
      </div>
      <div className="w-full">
        <label htmlFor="file-upload" className="block text-center cursor-pointer">
          <div className="border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100 transition rounded-2xl p-8 flex flex-col items-center">
            <Upload className="h-10 w-10 text-pink-400 mb-2" />
            <span className="text-base text-gray-500">
              {file ? file.name : "카카오톡 대화 텍스트 파일을 선택하세요"}
            </span>
          </div>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            key="file-upload"
          />
        </label>
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center w-full">{error}</p>
      )}
      <Button
        className="w-full bg-pink-500 text-white rounded-full py-4 text-lg font-bold shadow-md hover:bg-pink-600 transition"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? "업로드 중..." : "분석 시작하기"}
      </Button>
    </div>
  )
}

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-500 drop-shadow-sm">초개인화 선물 추천</h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-xl mx-auto">카카오톡 대화 내용을 분석해<br className="md:hidden"/> 당신만을 위한 선물을 추천해드려요.</p>
      </div>
      <Card className="w-full max-w-lg rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
        <CardContent className="p-10">
          <FileUpload />
        </CardContent>
      </Card>
      <div className="mt-12 text-center text-gray-400 text-sm">
        <span>※ 업로드한 파일은 분석 후 즉시 삭제됩니다.</span>
      </div>
    </section>
  )
}
