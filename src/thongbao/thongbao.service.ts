import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThongBao } from './thongbao.entity';
import { Like, Repository } from 'typeorm';
import { CreateThongBaoDTO } from './dto/create_thongbao.dto';
import { UpdateThongBaoDTO } from './dto/update_thongbao.dto';

@Injectable()
export class ThongbaoService {
  constructor(
    @InjectRepository(ThongBao)
    private thongBaoRepository: Repository<ThongBao>,
  ) {}

  async getAllThongBao(): Promise<ThongBao[]> {
    return await this.thongBaoRepository.find({ relations: ['nhanvien'] });
  }

  async getThongBao(maThongBao: number): Promise<ThongBao | null> {
    return await this.thongBaoRepository.findOne({
      where: { MaTB: maThongBao },
      relations: ['nhanvien'],
    });
  }

  async createThongBao(dto: CreateThongBaoDTO): Promise<ThongBao | null> {
    const created = this.thongBaoRepository.create(dto);
    const saved = await this.thongBaoRepository.save(created);
    return await this.thongBaoRepository.findOne({
      where: { MaTB: saved.MaTB },
      relations: ['nhanvien'],
    });
  }

  async updateThongBao(
    maThongBao: number,
    dto: Partial<UpdateThongBaoDTO>,
  ): Promise<ThongBao | null> {
    const existing = await this.thongBaoRepository.findOne({
      where: { MaTB: maThongBao },
    });
    if (!existing) throw new Error('Thông báo này không tồn tại!');
    const result = this.thongBaoRepository.merge(existing, dto);
    return await this.thongBaoRepository.save(result);
  }

  async deleteThongBao(maThongBao: number): Promise<ThongBao | null> {
    const existing = await this.thongBaoRepository.findOne({
      where: { MaTB: maThongBao },
    });
    if (!existing) return null;

    await this.thongBaoRepository.delete({ MaTB: maThongBao });
    return existing;
  }

  async searchThongBao(keyword: string, type: string): Promise<ThongBao[]> {
    if (type === 'Tiêu đề') {
      return await this.thongBaoRepository.find({
        where: { TieuDe: Like(`%${keyword}%`) },
      });
    } else if (type === 'Nội dung') {
      return await this.thongBaoRepository.find({
        where: { NoiDung: Like(`%${keyword}%`) },
      });
    }
    return [];
  }
}
