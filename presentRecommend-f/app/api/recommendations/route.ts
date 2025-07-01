import { type NextRequest, NextResponse } from "next/server";
import { generateGiftRecommendations } from "@/lib/analyze";

export async function POST(request: NextRequest) {
  try {
    const { fileId, analysis, filters } = await request.json();

    if (!analysis) {
      return NextResponse.json(
        { error: "분석 결과가 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    // 선물 추천 생성
    const recommendations = await generateGiftRecommendations(
      fileId,
      analysis,
      filters
    );

    if (recommendations.length === 0) {
      return NextResponse.json(
        { error: "조건에 맞는 선물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "선물 추천 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
