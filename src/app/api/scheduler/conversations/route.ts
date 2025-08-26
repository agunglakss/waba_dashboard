import { getWabaIds } from "@/app/model/customer";
import { yesterdayUTC7, toTimeStampStartDate, toTimeStampEndDate } from "@/lib/dateFormatter";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { insertPricingAnalyticBatch } from "@/app/model/conversation";
import { ok } from "assert";

type PricingAnalyticTuple = [
  string, // waba_id
  number, // start
  number, // end
  string, // phone_number
  string, // country
  string, // tier
  string, // pricing_type
  string, // pricing_category
  number, // cost
  number  // volume
];

type DataPoint = {
  start: number;
  end: number;
  phone_number: string;
  country: string;
  tier: string;
  pricing_type: string;
  pricing_category: string;
  cost: number;
  volume: number;
};


async function fetchApi(wabaId: string) {
  const dateNow = yesterdayUTC7();
  const startDate = toTimeStampStartDate(dateNow)
  const endDate = toTimeStampEndDate(dateNow)

  const response = await fetch(`${process.env.WA_URL}/${process.env.WA_VERSION}/${wabaId}?fields=pricing_analytics.start(${startDate}).end(${endDate}).granularity(DAILY).dimensions(PRICING_CATEGORY,PRICING_TYPE,TIER,COUNTRY,PHONE)`, 
                                {headers: { Authorization: `Bearer ${process.env.WA_TOKEN}` }})
  
  if (!response.ok) return [];
  return response.json();
}

export async function GET() {
  try {
    const wabaIds = await getWabaIds();

    const BATCH_SIZE = 50;
    const totalBatches = Math.ceil(wabaIds.length / BATCH_SIZE);
    
    let buffer: PricingAnalyticTuple[] = [];

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const currentBatch = wabaIds.slice(
        batchIndex * BATCH_SIZE,
        (batchIndex + 1) * BATCH_SIZE
      );

      await Promise.all(
        currentBatch.map(async (waba) => {
          const results = await fetchApi(waba.waba_id as string);
    
          if (results.pricing_analytics) {
            const mapDataPoints = results.pricing_analytics.data[0].data_points.map((data_point: DataPoint) => 
              [
                waba.waba_id,
                data_point.start,
                data_point.end,
                data_point.phone_number,
                data_point.country,
                data_point.tier || "",
                data_point.pricing_type,
                data_point.pricing_category,
                data_point.cost,
                data_point.volume,
              ]
            );
            buffer.push(...mapDataPoints);
          }
        })
      );

      const pricingAnalyticList = buffer.map((pricingAnalytic: PricingAnalyticTuple) => 
        sql`(${pricingAnalytic[0]}, ${pricingAnalytic[1]}, ${pricingAnalytic[2]}, ${pricingAnalytic[3]}, ${pricingAnalytic[4]}, ${pricingAnalytic[5]}, ${pricingAnalytic[6]}, ${pricingAnalytic[7]}, ${pricingAnalytic[8]}, ${pricingAnalytic[9]})`
      )

      // before batching insert check data is exist 
      if (pricingAnalyticList.length > 0) {
        await insertPricingAnalyticBatch(pricingAnalyticList);
      }

      // set buffer into empty array for optimization
      buffer = [];
    }
    return NextResponse.json({ status: ok }) 
  } catch(err) {
    console.log(err)
  }
}
