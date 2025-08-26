import { endTimeStamp, startTimeStamp, toTimeStampEndDate, toTimeStampStartDate } from "@/lib/dateFormatter";
import { NextResponse } from "next/server";
import { getSummaryAnalyticWithPhoneNumber, getWabaNameById } from "@/app/model/conversation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wabaId = searchParams.get("wabaId") || "";
    console.log(wabaId)
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    
    const startUnixTimeStamp = startDate == "null" ? startTimeStamp : toTimeStampStartDate(startDate);
    const endUnixTimeStamp = endDate == "null" ? endTimeStamp : toTimeStampEndDate(endDate);

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