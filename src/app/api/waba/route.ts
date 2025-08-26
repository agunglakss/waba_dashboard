import { NextRequest, NextResponse } from 'next/server';
import { getWabaList, getWabaCount } from '../../model/customer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const offset = (page - 1) * limit;
    
    // Get paginated data and total count
    const [wabaList, totalCount] = await Promise.all([
      getWabaList(limit, offset),
      getWabaCount()
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      data: wabaList,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching WABA data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WABA data' },
      { status: 500 }
    );
  }
}
