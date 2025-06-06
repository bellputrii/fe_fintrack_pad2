"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface DashboardData {
  saldoPraxis: number;
  saldoTechno: number;
  tagihanPraxis: number;
  tagihanTechno: number;
  saldoEkstra: number;
  tagihanEkstra: number;
  tagihanUangSaku: number;
  rekapSaldo: number;
  rekapTagihan: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal fetch data dashboard");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="pl-72 p-8">Loading...</div>;
  }

  if (!data) {
    return <div className="pl-72 p-8">Tidak dapat memuat data dashboard</div>;
  }

  return (
    <div className="min-h-screen transition-all pl-72 p-8 bg-white text-gray-900">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="PRAXIS ACADEMY" saldo={data.saldoPraxis} tagihan={data.tagihanPraxis} />
        <Card title="TECHNONATURA" saldo={data.saldoTechno} tagihan={data.tagihanTechno} />
        <Card title="EKSTRAKURIKULER" saldo={data.saldoEkstra} tagihan={data.tagihanEkstra} />
        <Card title="UANG SAKU SISWA" saldo={0} tagihan={data.tagihanUangSaku} />
      </div>

      {/* Rekapitulasi Keseluruhan */}
      <div className="mt-8">
        <Card title="REKAPITULASI KESELURUHAN" saldo={data.rekapSaldo} tagihan={data.rekapTagihan} fullWidth />
      </div>
    </div>
  );
}

// Komponen Card
function Card({ title, saldo, tagihan, fullWidth }: { title: string; saldo: number; tagihan: number; fullWidth?: boolean }) {
  // Format angka ke rupiah dengan opsi minimum fraction digits
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md bg-blue-900 text-white ${fullWidth ? "w-full" : ""}`}>
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      
      <div className="space-y-4">
        {saldo !== 0 && (
          <div>
            <label htmlFor="saldo-saat-ini" className="block text-sm mb-1">
              Saldo saat ini
            </label>
            <div className="relative">
              <input
                id="saldo-saat-ini"
                type="text"
                readOnly
                value={formatRupiah(saldo)}
                className="w-full p-3 bg-gray-100 text-gray-800 rounded-md border-none focus:ring-0 cursor-default"
                onMouseEnter={(e) => e.currentTarget.blur()}
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="tagihan-saat-ini" className="block text-sm mb-1">
            Tagihan saat ini
          </label>
          <div className="relative">
            <input
              id="tagihan-saat-ini"
              type="text"
              readOnly
              value={formatRupiah(tagihan)}
              className="w-full p-3 bg-gray-100 text-gray-800 rounded-md border-none focus:ring-0 cursor-default"
              onMouseEnter={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
