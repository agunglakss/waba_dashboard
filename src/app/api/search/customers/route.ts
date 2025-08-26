import { NextRequest, NextResponse } from 'next/server';
import { searchCustomers, getSearchCount, getAllCustomers, getWabaCount } from '../../../model/customer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;
    
    let data;
    let totalCount;
    
    if (search.trim()) {
      // Search customers
      data = await searchCustomers(search, limit, offset);
      totalCount = await getSearchCount(search);
    } else {
      // Get all customers
      data = await getAllCustomers(limit, offset);
      totalCount = await getWabaCount();
    }
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error in customers search API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
