import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';
// GET all leads
export async function GET(request: any) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM leads ORDER BY date_added DESC`
    );
    // Transform data to match your object structure
    const leads = (rows as any[]).map((row: { id: any; customer_name: any; sector: any; region: any; contact_person_name: any; contact_person_role: any; contact_person_email: any; product_name:any; lead_source: any; initial_use_case: any; stage: any; deal_value: string; deal_type: any; sales_owner: any; date_added: any; probability: any; }) => ({
      id: row.id,
      customerName: row.customer_name,
      sector: row.sector,
      region: row.region,
      contactPerson: {
        name: row.contact_person_name,
        role: row.contact_person_role,
        email: row.contact_person_email,
      },
      leadSource: row.lead_source,
      productName: row.product_name,
      initialUseCase: row.initial_use_case,
      stage: row.stage,
      dealValue: parseFloat(row.deal_value),
      dealType: row.deal_type,
      salesOwner: row.sales_owner,
      dateAdded: row.date_added,
      probability: row.probability,
    }));


    return NextResponse.json({
      leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST new lead
export async function POST(request: any) {
  try {
    const body = await request.json();
    const {
      customerName,
      sector,
      region,
      contactPerson,
      productName,
      leadSource,
      initialUseCase,
      stage,
      dealValue,
      dealType,
      salesOwner,
      probability,
    } = body;

    const connection = await getConnection();
    const sanitize = (value: any) => (value === undefined ? null : value);

    const [result]:[any,any] = await connection.execute(
      `INSERT INTO leads (
        customer_name, sector, region, contact_person_name, 
        contact_person_role, contact_person_email, product_name, lead_source, 
        initial_use_case, stage, deal_value, deal_type, 
        sales_owner, probability
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitize(customerName),
        sanitize(sector),
        sanitize(region),
        sanitize(contactPerson)?.name,
        sanitize(contactPerson)?.role,
        sanitize(contactPerson)?.email,
        sanitize(productName),
        sanitize(leadSource),
        sanitize(initialUseCase),
        sanitize(stage),
        sanitize(dealValue),
        sanitize(dealType),
        sanitize(salesOwner),
        sanitize(probability),
      ]
    );

    return NextResponse.json(
      { message: 'Lead created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}