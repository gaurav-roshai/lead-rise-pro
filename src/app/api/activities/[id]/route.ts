// app/api/activities/route.js
import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all activities (with optional lead_id filter)
export async function GET(request: any) {
  try {
    const connection = await getConnection();
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');


    let query = `
      SELECT a.*, l.customer_name 
      FROM activities a 
      LEFT JOIN leads l ON a.lead_id = l.id
    `;
    let queryParams = [];

    if (leadId) {
      query += ' WHERE a.lead_id = ?';
      queryParams.push(leadId);
    }

    query += ' ORDER BY a.date_added DESC';

    const [rows] = await connection.execute(query, queryParams);

    const activities = (rows as any[]).map(row => ({
      id: row.id,
      leadId: row.lead_id,
      customerName: row.customer_name,
      activityTitle: row.activity_title,
      activityType: row.activity_type,
      activityDescription: row.activity_description,
      dateAdded: row.date_added,
    }));

    return NextResponse.json({
      activities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST new activity
export async function POST(request:any) {
  try {
    const body = await request.json();
    const {
      leadId,
      activityTitle,
      activityType,
      activityDescription
    } = body;

    // Validate that lead exists
    const connection = await getConnection();
    const [leadCheck] = await connection.execute(
      'SELECT id FROM leads WHERE id = ?',
      [leadId]
    );

    if ((leadCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const [result] = await connection.execute(
      `INSERT INTO activities (
        lead_id, activity_title, activity_type, activity_description
      ) VALUES (?, ?, ?, ?)`,
      [leadId, activityTitle, activityType, activityDescription]
    );

    return NextResponse.json(
      { message: 'Activity created successfully'},
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}