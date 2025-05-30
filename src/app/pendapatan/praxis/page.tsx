'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Search, FileSignature, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Siswa {
  nama_siswa: string
  nisn: string
  level: string
  akademik: string
  id_siswa: number
  tagihan_uang_kbm: number
  tagihan_uang_spp: number
  tagihan_uang_pemeliharaan: number
  tagihan_uang_sumbangan: string | null
  total: number
}

export default function PendapatanPraxis() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedLevel') || 'X'
  }
  return 'X'
})

  const [data, setData] = useState<Siswa[]>([])
  const router = useRouter()

  // Konversi "1.000.000" ke 1000000
  const parseFormattedNumber = (value: string | null | undefined): number => {
    if (!value || value === 'Lunas') return 0
    return Number(value.replace(/\./g, ''))
  }

  // Simpan level yang dipilih ke localStorage
  useEffect(() => {
    localStorage.setItem('selectedLevel', selectedLevel)
  }, [selectedLevel])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/monitoring-praxis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ambil array siswa dari response.data.data.data
        const siswaArray = response.data.data?.data || [];

        const fetchedData = siswaArray.map((item: any) => {
          const tagihan = item.tagihan || {};

          const kbm = parseFormattedNumber(tagihan.tagihan_uang_kbm);
          const spp = parseFormattedNumber(tagihan.tagihan_uang_spp);
          const pemeliharaan = parseFormattedNumber(tagihan.tagihan_uang_pemeliharaan);
          const sumbanganVal = parseFormattedNumber(tagihan.tagihan_uang_sumbangan);

          return {
            nama_siswa: item.nama_siswa,
            nisn: item.nisn,
            level: item.level,
            akademik: item.akademik,
            id_siswa: item.id_siswa,
            tagihan_uang_kbm: kbm,
            tagihan_uang_spp: spp,
            tagihan_uang_pemeliharaan: pemeliharaan,
            tagihan_uang_sumbangan: tagihan.tagihan_uang_sumbangan === '0' ? 'Lunas' : tagihan.tagihan_uang_sumbangan,
            total: kbm + spp + pemeliharaan + sumbanganVal,
          };
        });

        setData(fetchedData);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        console.error('Error response:', error.response?.data);
      }
    };

    fetchData();
  }, []);
  

  const filteredData = useMemo(() => {
    return data
      .filter((item) => item.level === selectedLevel)
      .filter((item) =>
        item.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nisn.includes(searchTerm) ||
        item.akademik.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [searchTerm, selectedLevel, data])

  const columns = useMemo(
    () => [
      { accessorKey: 'nama_siswa', header: 'Nama Siswa' },
      { accessorKey: 'nisn', header: 'NISN' },
      {
        accessorKey: 'tagihan_uang_kbm',
        header: 'KBM',
        cell: ({ getValue }: any) => <span>{getValue().toLocaleString('id-ID')}</span>
      },
      {
        accessorKey: 'tagihan_uang_spp',
        header: 'SPP',
        cell: ({ getValue }: any) => <span>{getValue().toLocaleString('id-ID')}</span>
      },
      {
        accessorKey: 'tagihan_uang_pemeliharaan',
        header: 'Pemeliharaan',
        cell: ({ getValue }: any) => <span>{getValue().toLocaleString('id-ID')}</span>
      },
      {
        accessorKey: 'tagihan_uang_sumbangan',
        header: 'Sumbangan',
        cell: ({ getValue }: any) => (
          <span className={getValue() === 'Lunas' ? 'text-green-600 font-bold' : ''}>{getValue()}</span>
        )
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ getValue }: any) => <span>{getValue().toLocaleString('id-ID')}</span>
      },
      {
        accessorKey: 'kontrak',
        header: 'Kontrak',
        cell: ({ row }: any) => {
          const id_siswa = row.original.id_siswa
          return (
            <CreditCard
              id="kontrak"
              className="text-gray-600 cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/pendapatan/praxis/detail-praxis?id_siswa=${id_siswa}`)}
            />
          )
        }
      },
      {
        accessorKey: 'bayar',
        header: 'Bayar',
        cell: ({ row }: any) => {
          const id_siswa = row.original.id_siswa
          return (
            <FileSignature
              id="bayar"
              className="text-gray-600 cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/pendapatan/praxis/pembayaran-siswa?id_siswa=${id_siswa}`)}
            />
          )
        }
      }
    ],
    [router]
  )

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="ml-64 flex-1 bg-white min-h-screen p-6 text-black">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Monitoring Praxis Academy</h2>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex justify-start gap-2 items-center">
          <select
            id="level-select"
            className="px-2 py-1 bg-gray-300 text-black rounded-md text-sm"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="X">Level X</option>
            <option value="XI">Level XI</option>
            <option value="XII">Level XII</option>
          </select>
          <div className="relative">
            <input
              id="search-praxis"
              type="text"
              placeholder="Search..."
              className="px-2 py-1 pl-8 bg-gray-300 text-black rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className="absolute left-2 top-2 text-gray-700" />
          </div>
          <button className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-sm" onClick={() => router.push('/pendapatan/praxis/tambah-kontrak')}> + Tambah Kontrak</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-left text-sm text-black">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-blue-900 text-white">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-2 border">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
