import { Account } from 'src/account/account.entity';
import { HoaDon } from 'src/hoadon/hoadon.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class NhanVien {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  MaNV: string;

  @Column({ type: 'varchar', length: 50 })
  TenNV: string;

  // @Column({ type: 'varchar', length: 20, unique: true })
  // Username: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  Phone: string;

  @Column({ type: 'varchar', length: 16, unique: true })
  CCCD: string;

  @Column({ type: 'varchar', length: 255 })
  DiaChi: string;

  @Column({ type: 'int' })
  GioiTinh: number;

  @Column({ type: 'varchar', length: 255 })
  Image: string;

  @Column({ type: 'varchar', length: 255 })
  ImageCCCDFont: string;

  @Column({ type: 'varchar', length: 255 })
  ImageCCCDBack: string;

  @Column({ type: 'int', default: 0 })
  TrangThai: number;

  @OneToOne(() => Account, (account) => account.nhanvien)
  @JoinColumn({ name: 'username' })
  account: Account;

  @OneToMany(() => HoaDon, (hoadon) => hoadon.nhanViens)
  hoaDons: HoaDon[];
}
