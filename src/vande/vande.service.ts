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

  async searchVanDe(keyword: string): Promise<VanDe[]> {
    const isDate = /^\d{4}-\d{1,2}-\d{1,2}$/.test(keyword);
    const isMonth = /^\d{4}-\d{1,2}$/.test(keyword);
    const isYear = /^\d{4}$/.test(keyword);
    const where: any[] = [
      { TieuDe: Like(`%${keyword}%`) },
      { NoiDung: Like(`%${keyword}%`) },
      { PhanHoi: Like(`%${keyword}%`) },
      { MaNV: Like(`%${keyword}%`) },
      { MaSV: Like(`%${keyword}%`) },
    ];
    if (isDate) {
      where.push({ Ngay_tao: keyword });
    } else if (isMonth) {
      where.push({ Ngay_tao: Like(`${keyword}%`) });
    } else if (isYear) {
      where.push({ Ngay_tao: Like(`${keyword}%`) });
    }
    return await this.vandeRepository.find({
      where,
      relations: ['nhanvien', 'sinhvien'],
    });
  }
}
