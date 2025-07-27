import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, securityHeaders, corsHeaders } from '@/lib/auth/middleware'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phone');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause: any = {};

    // Filter by phone number if provided
    if (phoneNumber) {
      whereClause = {
        OR: [
          { fromNumber: phoneNumber },
          { toNumber: phoneNumber }
        ]
      };
    }

    // Fetch messages with user information
    const messages = await db.whatsAppMessage.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await db.whatsAppMessage.count({
      where: whereClause
    });

    // Get conversation threads (unique phone numbers)
    const conversationThreads = await db.whatsAppMessage.groupBy({
      by: ['fromNumber', 'profileName'],
      where: {
        direction: 'INCOMING'
      },
      _count: {
        id: true
      },
      _max: {
        createdAt: true
      },
      orderBy: {
        _max: {
          createdAt: 'desc'
        }
      },
      take: 20
    });

    return NextResponse.json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          id: msg.id,
          messageId: msg.messageId,
          direction: msg.direction,
          fromNumber: msg.fromNumber,
          toNumber: msg.toNumber,
          messageBody: msg.messageBody,
          profileName: msg.profileName,
          status: msg.status,
          isAutoResponse: msg.isAutoResponse,
          escalated: msg.escalated,
          sentAt: msg.sentAt,
          receivedAt: msg.receivedAt,
          createdAt: msg.createdAt,
          user: msg.user
        })),
        conversations: conversationThreads.map(thread => ({
          phoneNumber: thread.fromNumber,
          profileName: thread.profileName,
          messageCount: thread._count.id,
          lastMessageAt: thread._max.createdAt
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    }, { headers });

  } catch (error) {
    console.error('Error fetching WhatsApp messages:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch WhatsApp messages' 
      },
      { 
        status: 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders(request.headers.get('origin') || undefined),
      ...securityHeaders()
    }
  });
}