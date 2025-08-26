import { sql } from "drizzle-orm/sql";
import { db } from "../../../drizzle/db/db";
import { pricing_analytics } from "../../../drizzle/db/schema";

type SummaryAnalyticParams = {
  startDate: number;
  endDate: number;
  wabaId?: string;
}

export async function insertPricingAnalyticBatch(analyticList: ReturnType<typeof sql>[]) {
  if (analyticList.length === 0) return;
  
  try {
    const query = sql`
                    INSERT INTO ${pricing_analytics} 
                    (waba_id, start_date, end_date, phone_number, country_code, tier, pricing_type, pricing_category, cost, volume) 
                    VALUES ${sql.join(analyticList, sql`,`)}
                  `;
    await db.execute(query);
  } catch(error) {
    console.log(error);
  }
}

export async function getSummaryAnalytic({startDate, endDate, wabaId}: SummaryAnalyticParams) {
  try {
    
    let conditions = sql`start_date >= ${startDate} AND start_date <= ${endDate}`;

    if (wabaId) {
      conditions = sql`${conditions} AND waba_id = ${wabaId}`;
    }

    const query = sql `
      SELECT pricing_category, SUM(cost) as approximate_charges, SUM(volume) as deliveries
      FROM pricing_analytics
      WHERE ${conditions}
      GROUP BY pricing_category
    `;

    const results = await db.execute(query);
    return results.rows;
  } catch(error) {
    console.log(error)
    return [];
  }
}

export async function getSummaryAnalyticWithPhoneNumber({startDate, endDate, wabaId}: SummaryAnalyticParams) {
  try {
    
    let conditions = sql`start_date >= ${startDate} AND start_date <= ${endDate}`;

    if (wabaId) {
      conditions = sql`${conditions} AND waba_id = ${wabaId}`;
    }

    const query = sql `
      SELECT phone_number, pricing_category, SUM(cost) as approximate_charges, SUM(volume) as deliveries
      FROM pricing_analytics
      WHERE ${conditions}
      GROUP BY pricing_category, phone_number
      ORDER BY phone_number DESC;
    `;

    const results = await db.execute(query);
    return results.rows;
  } catch(error) {
    console.log(error)
    return [];
  }
}

export async function getWabaNameById(wabaId: string) {
  try {
    const query = sql `SELECT name FROM customers WHERE waba_id = ${wabaId} LIMIT 1`
    const wabaName = await db.execute(query);
    const { name } = wabaName.rows[0];
    return name;
  } catch(err) {
    console.log(err)
    return ""
  }
}
