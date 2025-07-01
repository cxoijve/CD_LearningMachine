import { type NextRequest, NextResponse } from "next/server"

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "파일이 업로드되지 않았습니다." },
        { status: 400 }
      )
    }

    // 파일 크기 확인
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기는 5MB를 초과할 수 없습니다." },
        { status: 400 }
      )
    }

    // 파일 형식 확인
    if (!file.name.endsWith(".txt")) {
      return NextResponse.json(
        { error: ".txt 파일만 지원됩니다." },
        { status: 400 }
      )
    }

    // 실제 분석 없이 바로 성공 응답 반환
    return NextResponse.json(
      { success: true, redirect: "/analysis" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing upload:", error)
    return NextResponse.json(
      { error: "파일 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
