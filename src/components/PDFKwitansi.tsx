// components/PDFKwitansi.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 20, // Padding lebih kecil untuk A5
    fontSize: 9, // Ukuran font lebih kecil
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10, // Margin lebih kecil
  },
  title: {
    fontSize: 14, // Ukuran lebih kecil
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10, // Ukuran lebih kecil
    marginBottom: 2,
  },
  logo: {
    width: 50, // Ukuran lebih kecil
    height: 50, // Ukuran lebih kecil
    alignSelf: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1, // Garis lebih tipis
    backgroundColor: '#000',
    marginVertical: 10, // Margin lebih kecil
  },
  section: {
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4, // Margin lebih kecil
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
    fontSize: 9, // Ukuran lebih kecil
  },
  value: {
    width: '60%',
    fontSize: 9, // Ukuran lebih kecil
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  cell: {
    padding: 5, // Padding lebih kecil
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8, // Ukuran lebih kecil
  },
  cell1: {
    flex: 2,
  },
  cell2: {
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  footer: {
    position: 'absolute',
    bottom: 15, // Posisi lebih dekat ke bawah
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8, // Ukuran lebih kecil
    color: '#666',
    paddingHorizontal: 20, // Padding horizontal
  },
  signature: {
    marginTop: 20, // Margin lebih kecil
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: 150, // Lebar lebih kecil
    textAlign: 'center',
    paddingTop: 3,
    fontSize: 9, // Ukuran lebih kecil
  },
});

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return format(date, 'dd MMMM yyyy', { locale: id });
  } catch {
    return '-';
  }
};

interface KwitansiData {
  namaSiswa: string;
  level: string;
  akademik: string;
  nisn: string;
  tanggalPembayaran: string;
  pembayaran: {
    kbm: number;
    spp: number;
    pemeliharaan: number;
    sumbangan: number;
    total: number;
  };
  catatan?: string;
}

export default function PDFKwitansi({ data }: { data: KwitansiData }) {
  const items = [
    { label: 'KBM', value: data.pembayaran.kbm },
    { label: 'SPP', value: data.pembayaran.spp },
    { label: 'Pemeliharaan', value: data.pembayaran.pemeliharaan },
    { label: 'Sumbangan', value: data.pembayaran.sumbangan },
  ];

  return (
    <Document>
      {/* Ubah size menjadi A5 */}
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          {/* Gunakan path /logo.png */}
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.title}>KWITANSI PEMBAYARAN</Text>
          <Text style={styles.subtitle}>PRAXIS ACADEMY</Text>
          <Text style={styles.subtitle}>
            Jl. Contoh No. 123, Jakarta - Indonesia
          </Text>
          <Text style={styles.subtitle}>Telp: (021) 123-4567</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.grid}>
            <Text style={styles.label}>Nomor Kwitansi</Text>
            <Text style={styles.value}>PA/{format(new Date(), 'yyyyMMdd')}/001</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.label}>Tanggal Pembayaran</Text>
            <Text style={styles.value}>{formatDate(data.tanggalPembayaran)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 9 }}>
            Data Siswa
          </Text>
          <View style={styles.grid}>
            <Text style={styles.label}>Nama Siswa</Text>
            <Text style={styles.value}>{data.namaSiswa || '-'}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.label}>NISN</Text>
            <Text style={styles.value}>{data.nisn || '-'}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.label}>Level</Text>
            <Text style={styles.value}>{data.level || '-'}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.label}>Akademik</Text>
            <Text style={styles.value}>{data.akademik || '-'}</Text>
          </View>
        </View>

        <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 9 }}>
          Rincian Pembayaran
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.cell1]}>Jenis Pembayaran</Text>
            <Text style={[styles.cell, styles.cell2]}>Jumlah</Text>
          </View>
          
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.cell, styles.cell1]}>{item.label}</Text>
              <Text style={[styles.cell, styles.cell2]}>
                {formatRupiah(item.value)}
              </Text>
            </View>
          ))}
          
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.cell, styles.cell1, { fontWeight: 'bold' }]}>
              TOTAL
            </Text>
            <Text style={[styles.cell, styles.cell2, { fontWeight: 'bold' }]}>
              {formatRupiah(data.pembayaran.total)}
            </Text>
          </View>
        </View>

        {data.catatan && (
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 9 }}>
              Catatan:
            </Text>
            <Text style={{ fontSize: 9 }}>{data.catatan}</Text>
          </View>
        )}

        <View style={styles.signature}>
          <View>
            <Text style={{ fontSize: 9 }}>Jakarta, {formatDate(new Date().toISOString())}</Text>
            <Text style={{ fontSize: 9 }}>Penerima,</Text>
            <View style={styles.signatureLine}>
              <Text>(__________________________)</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Kwitansi ini sah tanpa tanda tangan dan cap</Text>
          <Text>Terima kasih telah melakukan pembayaran</Text>
        </View>
      </Page>
    </Document>
  );
}