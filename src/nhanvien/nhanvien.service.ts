import { Injectable } from '@nestjs/common';
import { NhanVien } from './nhanvien.entity';
import { Account } from 'src/account/account.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNhanVienDTO } from './dto/create_nhanvien.dto';
import { UpdateNhanVienDTO } from './dto/update_nhanvien.dto';

@Injectable()
export class NhanvienService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(NhanVien)
    private readonly nhanvienRepository: Repository<NhanVien>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async getAllNhanVien(): Promise<NhanVien[]> {
    return await this.nhanvienRepository.find();
  }

  async getNhanVien(maNV: string): Promise<NhanVien | null> {
    return await this.nhanvienRepository.findOne({ where: { MaNV: maNV } });
  }

  async createNhanvien(
    dto: CreateNhanVienDTO,
    password?: string,
  ): Promise<NhanVien | null> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingSV = await queryRunner.manager.findOne(NhanVien, {
        where: { MaNV: dto.MaNV },
      });
      if (existingSV) {
        throw new Error('Mã nhân viên đã được sử dụng!');
      }

      let newAccount;

      if (password) {
        const existingAccount = await queryRunner.manager.findOne(Account, {
          where: { Username: dto.Username },
        });
        if (existingAccount) {
          throw new Error('Username đã tồn tại!');
        }

        newAccount = queryRunner.manager.create(Account, {
          Username: dto.Username,
          Password: password,
          ChucVu: 1,
          DateTime: new Date(),
          online: 0,
          log: '',
        });
        newAccount = await queryRunner.manager.save(Account, newAccount);
      } else {
        newAccount = null;
      }

      const newSV = queryRunner.manager.create(NhanVien, {
        ...dto,
        Username: dto.Username,
        TrangThai: 0,
        account: newAccount,
      });

      const savedSV = await queryRunner.manager.save(NhanVien, newSV);

      await queryRunner.commitTransaction();

      const fullNhanVien = await queryRunner.manager.findOne(NhanVien, {
        where: { MaNV: savedSV.MaNV },
        relations: ['account'],
      });
      return fullNhanVien;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateNhanVien(
    maSV: string,
    dto: Partial<UpdateNhanVienDTO>,
    password?: string,
  ): Promise<NhanVien | null> {
    const existing = await this.nhanvienRepository.findOne({
      where: { MaNV: maSV },
      relations: ['account'],
    });
    if (!existing) throw new Error('Sinh viên không tồn tại!');

    const updatedSV = this.nhanvienRepository.merge(existing, dto);

    if (password) {
      if (existing.account) {
        existing.account.Password = password;
        await this.accountRepository.save(existing.account);
      } else {
        const newAccount = this.accountRepository.create({
          Username: existing.Username,
          Password: password,
          ChucVu: 1,
          DateTime: new Date(),
          online: 0,
          log: '',
        });
        await this.accountRepository.save(newAccount);
        updatedSV.account = newAccount;
      }
    }

    return await this.nhanvienRepository.save(updatedSV);
  }

  async approvedNhanVien(maSV: string) {
    const nv = await this.nhanvienRepository.findOne({
      where: { MaNV: maSV },
    });
    if (!nv) {
      throw new Error('Không tìm thấy nhân viên');
    }

    if (nv.TrangThai === 1) {
      throw new Error('Sinh viên đã được duyệt trước đó');
    }

    nv.TrangThai = 1;
    return await this.nhanvienRepository.save(nv);
  }

  async cancelledNhanVien(maSV: string) {
    const nv = await this.nhanvienRepository.findOne({
      where: { MaNV: maSV },
    });
    if (!nv) {
      throw new Error('Không tìm thấy nhân viên');
    }
    if (nv.TrangThai === 2) {
      throw new Error('Nhân viên đã được hủy trước đó');
    }
    nv.TrangThai = 2;
    return await this.nhanvienRepository.save(nv);
  }

  async searchNhanVien(keyword: string): Promise<NhanVien[]> {
    const res = await this.nhanvienRepository.find({
      where: [{ MaNV: Like(`%${keyword}%`) }, { TenNV: Like(`%${keyword}%`) }],
    });
    return res;
  }
}
