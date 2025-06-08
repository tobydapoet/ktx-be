import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { Phong } from 'src/phong/phong.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('tbl_hoadon')
export class HoaDon {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  MaHD: string;

  @Column({ type: 'int' })
  SoDien: number;

  @Column({ type: 'int' })
  GiaDien: number;

  @Column({ type: 'int' })
  SoNuoc: number;

  @Column({ type: 'int' })
  GiaNuoc: number;

  @Column({ type: 'int' })
  GiaPhong: number;

  @Column({ type: 'int', default: null })
  ChiPhiKhac: number;

  @Column({ type: 'varchar', length: 20 })
  MaPhong: string;

  @Column({ type: 'varchar', length: 20 })
  MaNV: string;

  @ManyToOne(() => NhanVien, (nhanvien) => nhanvien.hoaDons)
  @JoinColumn({ name: 'MaNV' })
  nhanvien: NhanVien;

  @ManyToOne(() => Phong, (phong) => phong.hoaDons)
  @JoinColumn({ name: 'MaPhong' })
  phongs: Phong;
}
