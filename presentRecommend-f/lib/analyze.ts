// This is a simplified mock implementation
// In a real application, you would use NLP libraries or AI services

import { type GiftItem, type RecommendationResult } from "./utils";

export interface AnalysisResult {
  category: string;
  date: string;
  intimacy: number;
  keywords: {
    name: string;
    score: number;
  }[];
  subject: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  error: string | null;
}

// 파일 업로드 API 호출
export async function uploadFile(file: File): Promise<ApiResponse<{ fileId: string }>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    mode: "cors"
  });

  if (!response.ok) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  const result = (await response.json()) as ApiResponse<{ fileId: string }>;
  if (!result.success) {
    throw new Error(result.message || "파일 업로드에 실패했습니다.");
  }

  return result;
}

// 대화 분석 API 호출
export async function analyzeConversation(
  fileId: string
): Promise<ApiResponse<AnalysisResult[]>> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileId }),
    mode: "cors"
  });

  if (!response.ok) {
    throw new Error("대화 분석에 실패했습니다.");
  }

  const result = (await response.json()) as ApiResponse<AnalysisResult[]>;
  if (!result.success) {
    throw new Error(result.message || "분석 중 오류가 발생했습니다.");
  }

  return result;
}

// 선물 추천 API 호출
export async function generateGiftRecommendations(
  fileId: string
): Promise<ApiResponse<RecommendationResult[]>> {
  try {
    console.log("API 요청 시작:", {
      url: "/api/recommendations",
      method: "POST",
      fileId
    });

    const response = await fetch(
      "/api/recommendations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ fileId }),
      }
    );

    console.log("API 응답 상태:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 에러 응답:", {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = (await response.json()) as ApiResponse<RecommendationResult[]>;
    console.log("API 성공 응답:", result);

    if (!result.success) {
      throw new Error(result.message || "추천 중 오류가 발생했습니다.");
    }

    return result;
  } catch (error) {
    console.error("API 호출 중 상세 오류:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("네트워크 오류 상세:", {
        message: error.message,
        stack: error.stack
      });
      throw new Error(
        "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      );
    }
    if (error instanceof Error) {
      throw new Error(`선물 추천에 실패했습니다: ${error.message}`);
    }
    throw new Error("선물 추천에 실패했습니다.");
  }
}
