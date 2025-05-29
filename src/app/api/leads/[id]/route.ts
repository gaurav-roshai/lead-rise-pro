import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single lead
export async function GET(request: any, params: any) {
  try {
    const connection = await getConnection();
    const {id} = params;
    const [rows] = await connection.execute(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const row = (rows as any[])[0];
    const lead = {
      id: row.id,
      customerName: row.customer_name,
      sector: row.sector,
      region: row.region,
      contactPerson: {
        name: row.contact_person_name,
        role: row.contact_person_role,
        email: row.contact_person_email,
      },
      productName: row.product_name,
      leadSource: row.lead_source,
      initialUseCase: row.initial_use_case,
      stage: row.stage,
      dealValue: parseFloat(row.deal_value),
      dealType: row.deal_type,
      salesOwner: row.sales_owner,
      dateAdded: row.date_added,
      probability: row.probability,
    };

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PUT update lead
export async function PUT(request: any, params: any) {
  try {
    const { id } = await params;
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
        
    const [result] = await connection.execute(
      `UPDATE leads SET 
        customer_name = ?, sector = ?, region = ?,
        contact_person_name = ?, contact_person_role = ?,
        contact_person_email = ?, product_name = ?, lead_source = ?,
        initial_use_case = ?, stage = ?, deal_value = ?,
        deal_type = ?, sales_owner = ?, probability = ?
      WHERE id = ?`,
      [
        customerName,
        sector,
        region,
        contactPerson?.name,
        contactPerson?.role,
        contactPerson?.email,
        productName,
        leadSource,
        initialUseCase,
        stage,
        dealValue,
        dealType,
        salesOwner,
        probability,
        id
      ]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// PATCH update lead stage
export async function PATCH(request: any, params: any) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stage } = body;

    // Validate stage
    const validStages = ['prospect', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    if (!stage || !validStages.includes(stage.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid stage. Must be one of: ${validStages.join(', ')}` },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    
    // Check if lead exists first
    const [existingLead] = await connection.execute(
      'SELECT id FROM leads WHERE id = ?',
      [id]
    );

    if ((existingLead as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update only the stage
    const [result] = await connection.execute(
      'UPDATE leads SET stage = ? WHERE id = ?',
      [stage.toLowerCase(), id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Failed to update lead stage' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Lead stage updated successfully',
      stage: stage.toLowerCase()
    });
  } catch (error) {
    console.error('Error updating lead stage:', error);
    return NextResponse.json(
      { error: 'Failed to update lead stage' },
      { status: 500 }
    );
  }
}

// DELETE lead
export async function DELETE(request: any, { params }: any) {
  try {
    const { id } = await params;
    const connection = await getConnection();
        
    const [result] = await connection.execute(
      'DELETE FROM leads WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}