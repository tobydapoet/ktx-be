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

  async getAllVanDe(): Promise<any[]> {
    const result = await this.vandeRepository.find({
      relations: ['nhanvien', 'sinhvien'],
    });
    return result.map(vd => ({
      ...vd,
      nhanvien: vd.nhanvien ? { MaNV: vd.nhanvien.MaNV, TenNV: vd.nhanvien.TenNV } : null,
      sinhvien: vd.sinhvien ? { MaSV: vd.sinhvien.MaSV, TenSV: vd.sinhvien.TenSV } : null,
    }));
  }

  async getVanDe(maVD: number): Promise<any | null> {
    const vd = await this.vandeRepository.findOne({
      where: { MaVD: maVD },
      relations: ['nhanvien', 'sinhvien'],
    });
    if (!vd) return null;
    return {
      ...vd,
      nhanvien: vd.nhanvien ? { MaNV: vd.nhanvien.MaNV, TenNV: vd.nhanvien.TenNV } : null,
      sinhvien: vd.sinhvien ? { MaSV: vd.sinhvien.MaSV, TenSV: vd.sinhvien.TenSV } : null,
    };
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

  async searchVanDe(keyword: string): Promise<any[]> {
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
    const result = await this.vandeRepository.find({
      where,
      relations: ['nhanvien', 'sinhvien'],
    });
    return result.map(vd => ({
      ...vd,
      nhanvien: vd.nhanvien ? { MaNV: vd.nhanvien.MaNV, TenNV: vd.nhanvien.TenNV } : null,
      sinhvien: vd.sinhvien ? { MaSV: vd.sinhvien.MaSV, TenSV: vd.sinhvien.TenSV } : null,
    }));
  }
}
