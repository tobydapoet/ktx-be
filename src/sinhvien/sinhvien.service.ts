import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SinhVien } from './sinhvien.entity';
import { DataSource, DeepPartial, Like, Repository } from 'typeorm';
import { CreateSinhVienDTO } from './dto/create_sinhvien.dto';
import { UpdateSinhVienDTO } from './dto/update_sinhvien.dto';
import { Phong } from 'src/phong/phong.entity';
import { Account } from 'src/account/account.entity';

@Injectable()
export class SinhvienService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,
    @InjectRepository(Phong)
    private readonly phongRepository: Repository<Phong>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async getAllSinhVien(): Promise<SinhVien[]> {
    return await this.sinhVienRepository.find({
      relations: ['phong', 'account'],
    });
  }

  async getSinhVien(maSV: string): Promise<SinhVien | null> {
    return await this.sinhVienRepository.findOne({
      where: { MaSV: maSV },
      relations: ['phong', 'account'],
    });
  }

  async getWithUserName(username: string): Promise<SinhVien | null> {
    return await this.sinhVienRepository.findOne({
      where: { Username: username },
      relations: ['phong', 'account'],
    });
  }

  async existCCCD(cccd: string): Promise<SinhVien | null> {
    return await this.sinhVienRepository.findOne({ where: { CCCD: cccd } });
  }

  async existPhone(sdt: string): Promise<SinhVien | null> {
    return await this.sinhVienRepository.findOne({ where: { Phone: sdt } });
  }

  async createSinhVien(
    dto: CreateSinhVienDTO,
    password?: string,
  ): Promise<SinhVien | null> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingSV = await queryRunner.manager.findOne(SinhVien, {
        where: { MaSV: dto.MaSV },
      });

      const phong = await queryRunner.manager.findOne(Phong, {
        where: { MaPhong: dto.MaPhong },
      });
      if (!phong) {
        throw new Error('Phòng không tồn tại!');
      }
      if (Number(phong.LoaiPhong) !== Number(dto.GioiTinh)) {
        throw new Error('Giới tính sinh viên không phù hợp với loại phòng!');
      }
      if (existingSV) {
        throw new Error('Mã sinh viên đã được sử dụng!');
      }
      if (await this.existCCCD(dto.CCCD)) {
        throw new Error('Số CCCD đã được sử dụng!');
      }
      if (await this.existPhone(dto.Phone)) {
        throw new Error('Số điện thoại đã được sử dụng!');
      }

      if (password) {
        const existingAccount = await queryRunner.manager.findOne(Account, {
          where: { Username: dto.Username },
        });
        if (existingAccount) {
          throw new Error('Username đã tồn tại!');
        }

        const newAccount = queryRunner.manager.create(Account, {
          Username: dto.Username,
          Password: password,
          ChucVu: 1,
        });

        await queryRunner.manager.save(Account, newAccount);
      }

      function base64ToBuffer(data: string): Buffer | null {
        if (!data) return null;
        const base64 = data.includes(',') ? data.split(',')[1] : data;
        return Buffer.from(base64, 'base64');
      }

      const newSV = queryRunner.manager.create(SinhVien, {
        ...dto,
        Image: base64ToBuffer(dto.Image),
        ImageCCCDFront: base64ToBuffer(dto.ImageCCCDFront),
        ImageCCCDBack: base64ToBuffer(dto.ImageCCCDBack),
        TrangThai: 0,
      } as DeepPartial<SinhVien>);

      const savedSV = await queryRunner.manager.save(SinhVien, newSV);

      await queryRunner.commitTransaction();

      return savedSV;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getApproveSVInPhong(maPhong: string) {
    return this.sinhVienRepository.find({
      where: {
        phong: { MaPhong: maPhong },
        TrangThai: 1,
      },
      relations: ['phong'],
    });
  }

  async updateSinhVien(
    maSV: string,
    dto: Partial<UpdateSinhVienDTO>,
    password?: string,
  ): Promise<SinhVien | null> {
    const existing = await this.sinhVienRepository.findOne({
      where: { MaSV: maSV },
      relations: ['account', 'phong'],
    });

    if (!existing) throw new Error('Sinh viên không tồn tại!');

    if (
      dto.CCCD &&
      dto.CCCD !== existing.CCCD &&
      (await this.existCCCD(dto.CCCD))
    ) {
      throw new Error('Số CCCD đã được sử dụng!');
    }

    if (
      dto.Phone &&
      dto.Phone !== existing.Phone &&
      (await this.existPhone(dto.Phone))
    ) {
      throw new Error('Số điện thoại đã được sử dụng!');
    }
    if (dto.MaPhong && dto.MaPhong !== existing.MaPhong) {
      if (existing.TrangThai === 0) {
        dto.MaPhong = existing.MaPhong;
      } else {
        const newPhong = await this.phongRepository.findOne({
          where: { MaPhong: dto.MaPhong },
        });
        if (!newPhong) throw new Error('Phòng mới không tồn tại!');
        if (newPhong.LoaiPhong !== existing.GioiTinh) {
          throw new Error(
            'Loại phòng không phù hợp với giới tính của sinh viên!',
          );
        }
      }
    }

    function base64ToBuffer(data?: string): Buffer | undefined {
      if (!data) return undefined;
      const base64 = data.includes(',') ? data.split(',')[1] : data;
      return Buffer.from(base64, 'base64');
    }

    if (dto.Image) {
      const buffer = base64ToBuffer(dto.Image);
      if (buffer) existing.Image = buffer;
    }
    if (dto.ImageCCCDFront) {
      const buffer = base64ToBuffer(dto.ImageCCCDFront);
      if (buffer) existing.ImageCCCDFront = buffer;
    }
    if (dto.ImageCCCDBack) {
      const buffer = base64ToBuffer(dto.ImageCCCDBack);
      if (buffer) existing.ImageCCCDBack = buffer;
    }

    const updateData: DeepPartial<SinhVien> = {
      ...dto,
      Image: base64ToBuffer(dto.Image),
      ImageCCCDFront: base64ToBuffer(dto.ImageCCCDFront),
      ImageCCCDBack: base64ToBuffer(dto.ImageCCCDBack),
    };

    const updatedSV = this.sinhVienRepository.merge(existing, updateData);

    if (password) {
      if (existing.account) {
        existing.account.Password = password;
        await this.accountRepository.save(existing.account);
      } else {
        const newAccount = this.accountRepository.create({
          Username: existing.Username,
          Password: password,
          ChucVu: 1,
        });
        await this.accountRepository.save(newAccount);
        updatedSV.account = newAccount;
      }
    }

    if (dto.MaPhong && dto.MaPhong !== existing.phong?.MaPhong) {
      const phongMoi = await this.phongRepository.findOne({
        where: { MaPhong: dto.MaPhong },
      });

      if (!phongMoi) throw new Error('Phòng mới không tồn tại');

      if (existing.TrangThai === 1) {
        const phongCu = existing.phong;
        if (phongCu) {
          phongCu.SoSV = Math.max(0, phongCu.SoSV - 1);
          await this.phongRepository.save(phongCu);
        }

        phongMoi.SoSV += 1;
        await this.phongRepository.save(phongMoi);
      }

      updatedSV.phong = phongMoi;
      updatedSV.MaPhong = dto.MaPhong;
    }

    await this.sinhVienRepository.save(updatedSV);
    return await this.sinhVienRepository.findOne({
      where: { MaSV: maSV },
      relations: ['account', 'phong'],
    });
  }

  async approvedSinhVien(maSV: string) {
    const sv = await this.sinhVienRepository.findOne({
      where: { MaSV: maSV },
      relations: ['phong'],
    });
    if (!sv) {
      throw new Error('Không tìm thấy sinh viên');
    }

    if (sv.TrangThai === 1) {
      throw new Error('Sinh viên đã được duyệt trước đó');
    }
    if (sv.phong.SoSV === sv.phong.SoLuong) {
      throw new Error('Hiện tại phòng đã đầy!');
    }
    if (sv.GioiTinh !== sv.phong.LoaiPhong) {
      throw new Error('Giới tính không phù hợp!');
    }
    sv.phong.SoSV += 1;
    await this.phongRepository.save(sv.phong);
    sv.TrangThai = 1;
    return await this.sinhVienRepository.save(sv);
  }

  async cancelledSinhVien(maSV: string) {
    const sv = await this.sinhVienRepository.findOne({
      where: { MaSV: maSV },
      relations: ['phong'],
    });
    if (!sv) {
      throw new Error('Không tìm thấy sinh viên');
    }
    if (sv.TrangThai === 2) {
      throw new Error('Sinh viên đã được hủy trước đó');
    }
    sv.phong.SoSV -= 1;
    await this.phongRepository.save(sv.phong);
    sv.TrangThai = 2;
    return await this.sinhVienRepository.save(sv);
  }

  async searchSinhVien(keyword: string) {
    const res = await this.sinhVienRepository.find({
      where: [{ MaSV: Like(`%${keyword}%`) }, { TenSV: Like(`%${keyword}%`) }],
      relations: ['account', 'phong'],
    });
    return res;
  }
}
