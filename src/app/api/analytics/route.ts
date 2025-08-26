import { getSummaryAnalytic } from "@/app/model/conversation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const wabaId = searchParams.get("wabaId") || "";
   
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // TODO : create a model with phone number
    const data = await getSummaryAnalytic({startDate: parseInt(startDate), endDate: parseInt(endDate), wabaId: wabaId});
    return NextResponse.json(data);
  } catch(error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}