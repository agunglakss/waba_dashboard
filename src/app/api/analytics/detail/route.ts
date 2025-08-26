import { toTimeStampEndDate, toTimeStampStartDate, yesterdayUTC7 } from "@/lib/dateFormatter";
import { NextResponse } from "next/server";
import { getSummaryAnalyticWithPhoneNumber, getWabaNameById } from "@/app/model/conversation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wabaId = searchParams.get("wabaId") as string;
    const startDate = searchParams.get("startDate") as string;
    const endDate = searchParams.get("endDate") as string;
    
    const dateNow = yesterdayUTC7();
    
    const startUnixTimeStamp = startDate == "" ? toTimeStampStartDate(dateNow) : toTimeStampStartDate(startDate);
    const endUnixTimeStamp = endDate == "" ? toTimeStampEndDate(dateNow) : toTimeStampEndDate(endDate);

    const data = await getSummaryAnalyticWithPhoneNumber({startDate: startUnixTimeStamp, endDate: endUnixTimeStamp, wabaId: wabaId});
    const wabaName  = await getWabaNameById(wabaId);
    
    return NextResponse.json(
      { data, "waba_name": wabaName, "waba_id": wabaId }
    );
  } catch(error) {
    console.log(error)
  }
}