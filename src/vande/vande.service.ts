import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { VanDe } from './vande.entity';
import { CreateVanDeDTO, UpdateVanDeDTO } from './dto/vande.dto';

@Injectable()
export class VandeService {
  constructor(
    @InjectRepository(VanDe)
    private readonly vandeRepository: Repository<VanDe>,
  ) {}

  async getAllVanDe(): Promise<VanDe[]> {
    return await this.vandeRepository.find({
      relations: ['nhanvien', 'sinhvien'],
    });
  }

  async getVanDe(maVD: number): Promise<VanDe | null> {
    return await this.vandeRepository.findOne({
      where: { MaVD: maVD },
      relations: ['nhanvien', 'sinhvien'],
    });
  }

  async getVanDeByMaSV(maSV: string): Promise<VanDe[]> {
    return await this.vandeRepository.find({
      where: { MaSV: maSV },
      relations: ['sinhvien', 'nhanvien'],
    });
  }

  async createVanDe(dto: CreateVanDeDTO): Promise<VanDe | null> {
    // Đảm bảo MaNV là string hoặc null
    const data: Partial<VanDe> = { ...dto, MaNV: dto.MaNV ?? null };
    const vande = this.vandeRepository.create(data);
    return await this.vandeRepository.save(vande);
  }

  async updateVanDe(maVD: number, dto: UpdateVanDeDTO): Promise<VanDe | null> {
    const vande = await this.vandeRepository.findOne({ where: { MaVD: maVD } });
    if (!vande) throw new Error('Vấn đề không tồn tại!');
    if ('MaNV' in dto && (dto.MaNV === undefined || dto.MaNV === null)) {
      vande.MaNV = null;
    }
    Object.assign(vande, dto);
    return await this.vandeRepository.save(vande);
  }

  async deleteVanDe(maVD: number): Promise<VanDe | null> {
    const vande = await this.vandeRepository.findOne({ where: { MaVD: maVD } });
    if (!vande) throw new Error('Vấn đề không tồn tại!');
    await this.vandeRepository.remove(vande);
    return vande;
  }

  async searchVanDe(keyword: string, type: string): Promise<VanDe[]> {
    if (!keyword || !type) return [];

    if (type === 'Mã vấn đề') {
      const id = Number(keyword);
      if (isNaN(id)) return [];
      return await this.vandeRepository.find({
        where: { MaVD: id },
        relations: ['sinhvien', 'nhanvien'],
      });
    } else if (type === 'Mã sinh viên') {
      return await this.vandeRepository.find({
        where: { MaSV: Like(`%${keyword}%`) },
        relations: ['sinhvien', 'nhanvien'],
      });
    } else if (type === 'Mã nhân viên') {
      return await this.vandeRepository.find({
        where: { MaNV: Like(`%${keyword}%`) },
        relations: ['sinhvien', 'nhanvien'],
      });
    }

    return [];
  }
  async searchVanDeByMaSV(
    maSV: string,
    keyword: string,
    type: string,
  ): Promise<VanDe[]> {
    if (!keyword || !type || !maSV) return [];

    const baseWhere = { MaSV: maSV };

    if (type === 'Mã vấn đề') {
      const id = Number(keyword);
      if (isNaN(id)) return [];
      return await this.vandeRepository.find({
        where: { ...baseWhere, MaVD: id },
        relations: ['sinhvien', 'nhanvien'],
      });
    } else if (type === 'Mã sinh viên') {
      // Không cho tìm người khác, chỉ chính mình
      if (!maSV.includes(keyword)) return [];
      return await this.vandeRepository.find({
        where: baseWhere,
        relations: ['sinhvien', 'nhanvien'],
      });
    } else if (type === 'Mã nhân viên') {
      return await this.vandeRepository.find({
        where: { ...baseWhere, MaNV: Like(`%${keyword}%`) },
        relations: ['sinhvien', 'nhanvien'],
      });
    }

    return [];
  }
}
