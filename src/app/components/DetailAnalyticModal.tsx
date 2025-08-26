"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type DetailAnalyticModalProps = {
  isOpen: boolean;
  onClose: () => void;
  wabaId?: string;
};

type AnalyticRow = {
  phone_number: string;
  pricing_category: string;
  approximate_charges: string;
  deliveries: number;
};

export function DetailAnalyticModal({ isOpen, onClose, wabaId }: DetailAnalyticModalProps) {
  const searchParams = useSearchParams();

  const [data, setData] = useState<AnalyticRow[]>([]);
  const [wabaName, setWabaName] = useState("")
  const [loading, setLoading] = useState(false);

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    if (!isOpen || !wabaId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/analytics/detail?wabaId=${wabaId}&startDate=${startDate}&endDate=${endDate}`
        );

        const { data, waba_name } = await res.json();
        setData(data);
        setWabaName(waba_name)
      } catch (err) {
        console.error("Failed to fetch analytic:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, wabaId, startDate, endDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="absolute inset-0 bg-gray-700 opacity-30"></div>
      <div className="bg-white rounded-2xl shadow-lg min-w-1/2 max-w-full md:max-w-full p-6 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer h-8 w-8 rounded-full"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">{wabaId} | {wabaName}</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <>
            <table className="min-w-full md:max-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Phone Number</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Approximate Charges</th>
                  <th className="px-4 py-3 text-left">Deliveries</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {data.map((d) => (
                  <tr key={`${d.phone_number}-${d.pricing_category}`}>
                    <td className="px-4 py-3">{d.phone_number}</td>
                    <td className="px-4 py-3">{d.pricing_category}</td>
                    <td className="px-4 py-3 font-bold">IDR {parseInt(d.approximate_charges).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">{d.deliveries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
