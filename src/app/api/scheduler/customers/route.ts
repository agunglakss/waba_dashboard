import { WhatsAppCustomer } from '@/types/customer';
import { db } from '../../../../../drizzle/db/db';
import { customers } from '../../../../../drizzle/db/schema';
import { sql } from 'drizzle-orm/sql';
import { NextResponse } from 'next/server';

export async function GET() {
  const businessId = process.env.WA_BI;
  const limit = 2000;
  const url = `${process.env.WA_URL}/${process.env.WA_VERSION}/${businessId}/client_whatsapp_business_accounts?limit=${limit}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.WA_TOKEN}` },
  });

  const data = await response.json();
  
  const customerList = data.data.map((customer: WhatsAppCustomer) =>  sql`(${customer.id}, ${customer.name})`)
  
  const queryInsert = sql`
                          INSERT INTO ${customers} (waba_id, name) 
                          values ${sql.join(customerList, sql`, `)} 
                          ON CONFLICT (waba_id)
                          DO UPDATE SET name = EXCLUDED.name
                          WHERE ${customers.name} IS DISTINCT FROM EXCLUDED.name
                        `
  await db.execute(queryInsert);
  
  return NextResponse.json({ message: 'Insert' }, { status: 201 });
}