import { Account } from 'src/account/account.entity';
import { HopDong } from 'src/hopdong/hopdong.entity';
import { Phong } from 'src/phong/phong.entity';
import { VanDe } from 'src/vande/vande.entity';
import { ChiTietHoaDon } from 'src/hoadon/chitiethoadon.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('tbl_sinhvien')
export class SinhVien {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  MaSV: string;

  @Column({ type: 'varchar', length: 50 })
  TenSV: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  Username: string;

  @Column({ type: 'varchar', length: 20 })
  MaPhong: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  Phone: string;

  @Column({ type: 'varchar', length: 16, unique: true })
  CCCD: string;

  @Column({ type: 'varchar', length: 255 })
  DiaChi: string;

  @Column({ type: 'varchar', length: 30 })
  Class: string;

  @Column({ type: 'int' })
  GioiTinh: number;

  @Column({ type: 'longblob' })
  Image: Buffer;

  @Column({ type: 'longblob' })
  ImageCCCDFront: Buffer;

  @Column({ type: 'longblob' })
  ImageCCCDBack: Buffer;

  @Column({ type: 'int', default: 0 })
  TrangThai: number;

  @ManyToOne(() => Phong, (phong) => phong.sinhViens)
  @JoinColumn({ name: 'MaPhong', referencedColumnName: 'MaPhong' })
  phong: Phong;

  @OneToOne(() => Account, (account) => account.sinhvien)
  @JoinColumn({ name: 'Username', referencedColumnName: 'Username' })
  account: Account;

  @OneToMany(() => HopDong, (hopdong) => hopdong.sinhvien)
  hopDongs: HopDong[];

  @OneToMany(() => VanDe, (vande) => vande.sinhvien)
  vanDes: VanDe[];

  @OneToMany(() => ChiTietHoaDon, (ct) => ct.sinhvien)
  chiTietHoaDon: ChiTietHoaDon[];
}
