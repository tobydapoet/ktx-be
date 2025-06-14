import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';

@Entity('tbl_chitiethoadon')
export class ChiTietHoaDon {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  MaHD: string;

  @PrimaryColumn({ type: 'varchar', length: 20 })
  MaSV: string;

  @Column({ type: 'double' })
  TongTien: number;

  @Column({ type: 'int', default: 0 })
  TrangThai: number; // 0: chưa thanh toán, 1: đã thanh toán, -1: quá hạn

  @ManyToOne(() => HoaDon, (hoadon) => hoadon.chiTiet)
  @JoinColumn({ name: 'MaHD' })
  hoadon: HoaDon;

  @ManyToOne(() => SinhVien, (sv) => sv.chiTietHoaDon)
  @JoinColumn({ name: 'MaSV' })
  sinhvien: SinhVien;
}
