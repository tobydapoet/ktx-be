import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phong } from './phong.entity';
import { Like, Repository } from 'typeorm';
import { CreatePhongDTO } from './dto/create_phong.dto';
import { UpdatePhongDTO } from './dto/update_phong.dto';

@Injectable()
export class PhongService {
  constructor(
    @InjectRepository(Phong)
    private readonly phongRepository: Repository<Phong>,
  ) {}

  async getAllPhong(): Promise<Phong[]> {
    return await this.phongRepository.find();
  }

  async getPhong(maPhong: string): Promise<Phong | null> {
    return await this.phongRepository.findOne({ where: { MaPhong: maPhong } });
  }

  async createPhong(dto: CreatePhongDTO): Promise<Phong> {
    const existing = await this.phongRepository.findOne({
      where: {
        MaPhong: dto.MaPhong,
      },
    });
    if (existing) {
      throw new Error('Phòng này đã tồn tại!');
    }
    const newPhong = this.phongRepository.create({
      ...dto,
      TrangThai: 0,
      SoSV: 0,
    });

    return await this.phongRepository.save(newPhong);
  }

  async updatePhong(
    maPhong: string,
    dto: Partial<UpdatePhongDTO>,
  ): Promise<Phong | null> {
    const existing = await this.phongRepository.findOne({
      where: { MaPhong: maPhong },
    });

    if (!existing) throw new Error('Sinh viên không tồn tại!');

    const result = this.phongRepository.merge(existing, dto);
    return await this.phongRepository.save(result);
  }

  async approvedPhong(maPhong: string) {
    const phong = await this.phongRepository.findOne({
      where: { MaPhong: maPhong },
    });
    if (!phong) {
      throw new Error('Không tìm thấy phòng');
    }

    if (phong.TrangThai === 1) {
      throw new Error('Phòng đã được duyệt trước đó');
    }

    phong.TrangThai = 1;
    return await this.phongRepository.save(phong);
  }

  async cancelledPhong(maPhong: string) {
    const phong = await this.phongRepository.findOne({
      where: { MaPhong: maPhong },
    });
    if (!phong) {
      throw new Error('Không tìm thấy phòng');
    }

    if (phong.TrangThai === 0) {
      throw new Error('Phòng đã được hủy trước đó');
    }

    phong.TrangThai = 0;
    return await this.phongRepository.save(phong);
  }

  async searchPhong(keyword: string): Promise<Phong[]> {
    return await this.phongRepository.find({
      where: { MaPhong: Like(`%${keyword}%`) },
    });
  }
}
