import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { NextResponse } from 'next/server'

export interface GiftItem {
  name: string
  brand: string
  price: number
  productUrl: string
  imageUrl: string
}

let cachedGiftItems: GiftItem[] | null = null

async function readGiftItems(): Promise<GiftItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'app', 'yogu', 'data', '골프선물_상품목록.csv')
    console.log('Reading file from:', filePath)
    
    const fileContent = await fs.readFile(filePath, 'utf-8')
    console.log('File content length:', fileContent.length)
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
    console.log('Parsed records count:', records.length)

    return records.map((record: any) => ({
      name: record['상품명'],
      brand: record['브랜드'],
      price: parseInt(record['가격'].replace(/[^0-9]/g, ''), 10),
      productUrl: record['상품URL'],
      imageUrl: record['이미지URL'],
    }))
  } catch (error) {
    console.error('Error reading gift items:', error)
    if (error instanceof Error) {
      throw new Error(`CSV 파일 읽기 실패: ${error.message}`)
    }
    throw new Error('알 수 없는 오류가 발생했습니다.')
  }
}

function filterGiftItems(
  items: GiftItem[],
  budget: number,
  keywords: string[] = []
): GiftItem[] {
  return items
    .filter(item => item.price <= budget)
    .filter(item => {
      if (keywords.length === 0) return true
      const itemText = `${item.name} ${item.brand}`.toLowerCase()
      return keywords.some(keyword => itemText.includes(keyword.toLowerCase()))
    })
    .sort((a, b) => b.price - a.price) // 가격 높은 순으로 정렬
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const budget = parseInt(searchParams.get('budget') || '200000', 10)
    const keywords = searchParams.get('keywords')?.split(',') || []

    console.log('Request params:', { budget, keywords })

    if (!cachedGiftItems) {
      console.log('Loading gift items from CSV...')
      cachedGiftItems = await readGiftItems()
      console.log('Loaded gift items count:', cachedGiftItems.length)
    }

    const filteredItems = filterGiftItems(cachedGiftItems, budget, keywords)
    console.log('Filtered items count:', filteredItems.length)

    if (filteredItems.length === 0) {
      return NextResponse.json(
        { error: '조건에 맞는 선물을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(filteredItems.slice(0, 3))
  } catch (error) {
    console.error('Error in GET /api/gifts:', error)
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json(
      { error: `선물 목록을 가져오는데 실패했습니다: ${errorMessage}` },
      { status: 500 }
    )
  }
} 