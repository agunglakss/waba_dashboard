import { toTimeStampEndDate, toTimeStampStartDate, yesterdayUTC7 } from "@/lib/dateFormatter";
import { NextResponse } from "next/server";
import { getSummaryAnalyticWithPhoneNumber, getWabaNameById } from "@/app/model/conversation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const wabaId = searchParams.get("wabaId") || "";
    const startDate = searchParams.get("startDate") || yesterdayUTC7();
    const endDate = searchParams.get("endDate") || yesterdayUTC7();
    
    const startUnixTimeStamp = toTimeStampStartDate(startDate);
    const endUnixTimeStamp = toTimeStampEndDate(endDate);

    const data = await getSummaryAnalyticWithPhoneNumber({startDate: startUnixTimeStamp, endDate: endUnixTimeStamp, wabaId: wabaId});
    const wabaName  = await getWabaNameById(wabaId);
    console.log(data);
    return NextResponse.json(
      { data, "waba_name": wabaName, "waba_id": wabaId }
    );
  } catch(error) {
    console.log(error)
  }
}