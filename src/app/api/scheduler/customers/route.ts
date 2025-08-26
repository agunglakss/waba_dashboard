import { WhatsAppCustomer } from '@/types/customer';
import { db } from '../../../../../drizzle/db/db';
import { customers } from '../../../../../drizzle/db/schema';
import { sql } from 'drizzle-orm/sql';
import { NextResponse } from 'next/server';

export async function GET() {
  // 911892160212699 - Indosat Business
  // 2265758040370935 - Indosat Ooredoo Hutchison - Indonesia
  
  const businessId = "911892160212699";
  const limit = 2000;
  const url = `${process.env.WA_URL}/${process.env.WA_VERSION}/${businessId}/owned_whatsapp_business_accounts?limit=${limit}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}` },
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

// new
// EAAOAXiFxKpUBPBkOQ4CaK2P3rxQO87ccEPWEKnb3MYwneba9ZBo0QBMLC4wBZA2HAXhNqbO0ZAlsR9EVM11Ks4o3Um1EoWlswBCsLSZCVQ1MESgq1aWZARZBZBDFDYI1GZCm5UuvZBqjLZAMFbYVEcx71KeY1CLGMRRfaKTxXXee8A0ndZCp9yGN5VQKxFJZAJJUZA34vgDi79dTLDY2rYmSd3h0K8oKJXRkr6ZC84pYX1C6yiH6IZD


// old
// EAAIP6mZBqvRkBO7zBFnvxiyXKMRQxUzSlvsOsrmu17zr1OOTJh1dep5VjlyQ58OiDKbpsYNnZAcnHMxm54zuSIHWe6uc61OLitxcqQKVx0IMlc3HuHctHxwmu05l6GPqFNVSJLw9y4kZBSTrvWKsZCdJibZARAQudh1ncYZC6RJVJFuV2PZAXBAFklXnwZBozRoFUgZDZD