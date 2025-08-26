import { toTimeStampEndDate, toTimeStampStartDate, yesterdayUTC7 } from "@/lib/dateFormatter";
import { NextResponse } from "next/server";
import { getSummaryAnalyticWithPhoneNumber, getWabaNameById } from "@/app/model/conversation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateNow = yesterdayUTC7();
    console.log("Detail " + dateNow)
    const wabaId = searchParams.get("wabaId") || "";
    const startDate = searchParams.get("startDate") || dateNow;
    const endDate = searchParams.get("endDate") || dateNow;
    console.log("Detail startDate " + startDate)
    const startUnixTimeStamp = toTimeStampStartDate(startDate);
    console.log("Detail startUnixTimeStamp " + startUnixTimeStamp)
    const endUnixTimeStamp = toTimeStampEndDate(endDate);

    const data = await getSummaryAnalyticWithPhoneNumber({startDate: startUnixTimeStamp, endDate: endUnixTimeStamp, wabaId: wabaId});
    const wabaName  = await getWabaNameById(wabaId);
    
    return NextResponse.json(
      { data, "waba_name": wabaName, "waba_id": wabaId }
    );
  } catch(error) {
    console.log(error)
  }
}