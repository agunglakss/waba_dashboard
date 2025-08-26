import { sql } from "drizzle-orm/sql";
import { db } from "../../../drizzle/db/db";
import { customers } from "../../../drizzle/db/schema";

type Waba = {
  waba_id: string;
  name: string;
};

export async function insertCustomerBch(customerList: []) {
  try {
    const query = sql`
                    INSERT INTO ${customers} (waba_id, name) 
                    values ${customerList.join(',')} 
                    ON CONFLICT (waba_id) DO NOTHING
                  `;
    await db.execute(query);
  } catch(err) {
    console.log(err);
  }
}

export async function getWabaIds() {
  try {
    const querySelect = sql `SELECT waba_id from customers`
    const wabaIds = await db.execute(querySelect);

    return wabaIds.rows;
  } catch(err) {
    console.log(err)
    return [];
  }
}

export async function getWabaList(limit: number, offset: number): Promise<Waba[]> {
  try {
    const query = sql`SELECT waba_id, name 
                    FROM customers 
                    ORDER BY id ASC 
                    LIMIT ${limit} OFFSET ${offset};`
    
    const wabaList = await db.execute(query)
    return wabaList.rows as Waba[]
  } catch(error) {
    console.log(error)
    return [];
  }
}

export async function getWabaCount(): Promise<number> {
  try {
    const query = sql`SELECT COUNT(*) as count FROM customers`;
    const result = await db.execute(query);
    
    const count = result.rows[0] as { count: string };
    return parseInt(count?.count || '0');
  } catch(error) {
    console.log(error);
    return 0;
  }
}

export async function searchCustomers(searchTerm: string, limit: number, offset: number): Promise<Waba[]> {
  try {
    const query = sql`
      SELECT waba_id, name 
      FROM customers 
      WHERE waba_id ILIKE ${`%${searchTerm}%`} OR name ILIKE ${`%${searchTerm}%`}
      ORDER BY id ASC 
      LIMIT ${limit} OFFSET ${offset};
    `;
    
    const searchResults = await db.execute(query);
    return searchResults.rows as Waba[];
  } catch(error) {
    console.log(error);
    return [];
  }
}

export async function getSearchCount(searchTerm: string): Promise<number> {
  try {
    const query = sql`
      SELECT COUNT(*) as count 
      FROM customers 
      WHERE waba_id ILIKE ${`%${searchTerm}%`} OR name ILIKE ${`%${searchTerm}%`}
    `;
    const result = await db.execute(query);
    
    const count = result.rows[0] as { count: string };
    return parseInt(count?.count || '0');
  } catch(error) {
    console.log(error);
    return 0;
  }
}

export async function getAllCustomers(limit: number, offset: number): Promise<Waba[]> {
  try {
    const query = sql`
      SELECT waba_id, name 
      FROM customers 
      ORDER BY id ASC 
      LIMIT ${limit} OFFSET ${offset};
    `;
    
    const customers = await db.execute(query);
    return customers.rows as Waba[];
  } catch(error) {
    console.log(error);
    return [];
  }
}