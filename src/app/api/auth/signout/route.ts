import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await deleteSession();
    
    const response = NextResponse.json({ success: true });
    response.cookies.delete('session-token');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sign out' }, 
      { status: 500 }
    );
  }
}
