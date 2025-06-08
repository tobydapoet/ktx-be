import { Account } from 'src/account/account.entity';
import { Phong } from 'src/phong/phong.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class SinhVien {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  MaSV: string;

  @Column({ type: 'varchar', length: 50 })
  TenSV: string;

  // @Column({ type: 'varchar', length: 20, unique: true })
  // Username: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  Phone: string;

  @Column({ type: 'varchar', length: 16, unique: true })
  CCCD: string;

  @Column({ type: 'varchar', length: 255 })
  DiaChi: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  Class: string;

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

  @ManyToOne(() => Phong, (phong) => phong.sinhViens)
  @JoinColumn({ name: 'MaPhong' })
  phong: Phong;

  @OneToOne(() => Account, (account) => account.sinhvien)
  @JoinColumn({ name: 'username' })
  account: Account;
}
