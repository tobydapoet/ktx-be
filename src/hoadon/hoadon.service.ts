import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { CreateHoaDonDTO } from './dto/create_hoadon.dto';
import { UpdateHoaDonDTO } from './dto/update_hoadon.dto';

@Injectable()
export class HoadonService {
  constructor(
    @InjectRepository(HoaDon)
    private readonly hoadonRepository: Repository<HoaDon>,
  ) {}

  async getAllHoaDon(): Promise<HoaDon[]> {
    return await this.hoadonRepository.find({
      relations: ['nhanvien', 'phongs'],
    });
  }

  async getHoaDon(maHD: string): Promise<HoaDon | null> {
    return await this.hoadonRepository.findOne({
      where: { MaHD: maHD },
      relations: ['nhanvien', 'phongs'],
    });
  }

  async createHoaDon(dto: CreateHoaDonDTO): Promise<HoaDon | null> {
    const created = this.hoadonRepository.create(dto);
    const saved = await this.hoadonRepository.save(created);
    return await this.hoadonRepository.findOne({
      where: { MaHD: saved.MaHD },
      relations: ['nhanvien', 'phongs'],
    });
  }

  async updateHoaDon(
    maHD: string,
    dto: Partial<UpdateHoaDonDTO>,
  ): Promise<HoaDon | null> {
    const existing = await this.hoadonRepository.findOne({
      where: { MaHD: maHD },
    });
    if (!existing) throw new Error('Hóa đơn không tồn tại!');
    const result = this.hoadonRepository.merge(existing, dto);
    return await this.hoadonRepository.save(result);
  }

  async deleteHoaDon(maHD: string): Promise<HoaDon | null> {
    const existing = await this.hoadonRepository.findOne({
      where: { MaHD: maHD },
      relations: ['nhanvien', 'phongs'],
    });
    if (!existing) return null;
    await this.hoadonRepository.delete({ MaHD: maHD });
    return existing;
  }

  async searchHoaDon(keyword: string): Promise<HoaDon[]> {
    return await this.hoadonRepository.find({
      where: [
        { MaHD: Like(`%${keyword}%`) },
        { MaPhong: Like(`%${keyword}%`) },
        { MaNV: Like(`%${keyword}%`) },
      ],
      relations: ['nhanvien', 'phongs'],
    });
  }
}
