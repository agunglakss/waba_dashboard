"use client";

import { useEffect, useState } from "react";

import { toTimeStampEndDate, toTimeStampStartDate, yesterdayUTC7 } from "@/lib/dateFormatter";
import { PRICING_CATEGORY_LABELS } from "@/lib/constants/PRICING_CATEGORY_LABELS";
import { useRouter, useSearchParams } from "next/navigation";

interface SummaryAnalyticItem {
  pricing_category: string;
  approximate_charges: string;
  deliveries: string;
}

export default function FilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [startDate, setStartDate] = useState(searchParams.get("startDate") || yesterdayUTC7());
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || yesterdayUTC7());
  const [wabaId, setWabaId] = useState(searchParams.get("wabaId") || "");
  const [data, setData] = useState<SummaryAnalyticItem[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const startDateTimeUnix = toTimeStampStartDate(startDate);
      const endDateTimeUnix = toTimeStampEndDate(endDate);
      
      const res = await fetch(
        `/api/analytics?startDate=${startDateTimeUnix}&endDate=${endDateTimeUnix}&wabaId=${wabaId}`
      );
      const json = await res.json();
      setData(json);
    };
  
    fetchData();
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    router.push(
      `/dashboard?startDate=${startDate}&endDate=${endDate}&wabaId=${wabaId}`
    );
  };

  const summaryAnalyticsMap = new Map(
    data.map((item) => [item.pricing_category, item])
  );

  const transformSummaryAnalytics = Object.entries(PRICING_CATEGORY_LABELS).map(
    ([key, label]) => {
      const item =
        summaryAnalyticsMap.get(key) || {
          approximate_charges: "0",
          deliveries: "0",
        };
      return {
        pricing_category: key,
        label,
        ...item,
      };
    }
  );
  return(
    <section className="pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Hi, Agung Laksono
        </h2>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label
              htmlFor="keyword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Waba ID
            </label>
            <input
              type="text"
              value={wabaId} onChange={(e) => setWabaId(e.target.value)}
              placeholder="Search by Waba ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6  ">
          {transformSummaryAnalytics.map(item => (
            <div key={item.pricing_category} className="shadow-sm rounded-md px-3 py-4 hover:shadow-md">
            <p className="text-gray-700 text-md font-bold pb-3">IDR <br></br>{parseFloat(item.approximate_charges).toLocaleString("id-ID")}</p>
            <p className="text-gray-500 text-sm font-light">{item.deliveries}</p>
            <h3 className="text-sm font-semibold text-gray-800">
              {item.label}
            </h3>
          </div>
          ))}
        </div>
      </div>
    </section>
  )
}

