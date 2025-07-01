import "@/styles/globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Gift } from "lucide-react"
import { AnalysisProvider } from "@/context/analysis-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "선물 주니",
  description: "카카오톡 대화 기반 맞춤형 선물 추천 서비스",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-900`}> 
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
            <Link href="/" className="flex items-center text-2xl font-extrabold text-primary gap-2">
              <Gift className="text-pink-500 w-8 h-8" />
              선물 주니
            </Link>
            <nav>
              <ul className="flex gap-6 text-base font-semibold">
                <li><Link href="/" className="hover:text-pink-500 transition">홈</Link></li>
                <li><Link href="/analysis" className="hover:text-pink-500 transition">분석</Link></li>
                <li><Link href="/recommendations" className="hover:text-pink-500 transition">추천</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto py-10 px-4 md:px-0 min-h-[70vh]">
          <AnalysisProvider>{children}</AnalysisProvider>
        </main>
        <footer className="bg-white/80 border-t border-gray-100 text-center py-6 text-gray-500 text-sm mt-12 shadow-inner">
          <div className="container mx-auto">
            © 2025 선물 주니. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
