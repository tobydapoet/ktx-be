import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { HopDong } from './hopdong.entity';
import { CreateHopDongDto } from './dto/create_hopdong.dto';
import { UpdateHopDongDto } from './dto/update_hopdong.dto';

@Injectable()
export class HopdongService {
  constructor(
    @InjectRepository(HopDong)
    private readonly hopdongRepository: Repository<HopDong>,
  ) {}

  async create(createHopDongDto: CreateHopDongDto): Promise<HopDong> {
    const existing = await this.hopdongRepository.findOne({
      where: { MaHD: createHopDongDto.MaHD },
    });
    if (existing) {
      throw new ConflictException('Hợp đồng với MaHD này đã tồn tại!');
    }
    const hopdong = this.hopdongRepository.create(createHopDongDto);
    return this.hopdongRepository.save(hopdong);
  }

  async findAll(): Promise<HopDong[]> {
    return this.hopdongRepository.find();
  }

  async findOne(MaHD: string): Promise<HopDong | null> {
    const hopdong = await this.hopdongRepository.findOne({ where: { MaHD } });
    if (!hopdong) {
      throw new NotFoundException('Không tìm thấy hợp đồng với MaHD: ' + MaHD);
    }
    return hopdong;
  }

  async update(
    MaHD: string,
    updateHopDongDto: UpdateHopDongDto,
  ): Promise<HopDong | null> {
    const hopdong = await this.findOne(MaHD);
    if (!hopdong) {
      throw new NotFoundException('Không tìm thấy hợp đồng với MaHD: ' + MaHD);
    }
    await this.hopdongRepository.update(MaHD, updateHopDongDto);
    return this.findOne(MaHD);
  }

  async remove(MaHD: string): Promise<{ message: string }> {
    const result = await this.hopdongRepository.delete(MaHD);
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy hợp đồng với MaHD: ' + MaHD);
    }
    return { message: 'Xóa hợp đồng thành công' };
  }
  async searchByKeyword(keyword: string): Promise<HopDong[]> {
    return this.hopdongRepository.find({
      where: [
        { MaHD: Like(`%${keyword}%`) },
        { MaPhong: Like(`%${keyword}%`) },
        { MaSV: Like(`%${keyword}%`) },
        { MaNV: Like(`%${keyword}%`) },
      ],
    });
  }

  async searchHopDong(keyword: string): Promise<HopDong[]> {
    const isDate = /^\d{4}-\d{1,2}-\d{1,2}$/.test(keyword);
    const isMonth = /^\d{4}-\d{1,2}$/.test(keyword);
    const isYear = /^\d{4}$/.test(keyword);
    const where: any[] = [
      { MaHD: Like(`%${keyword}%`) },
      { MaPhong: Like(`%${keyword}%`) },
      { MaSV: Like(`%${keyword}%`) },
      { MaNV: Like(`%${keyword}%`) },
    ];
    if (isDate) {
      where.push({ NgayBD: keyword });
      where.push({ NgayKT: keyword });
    } else if (isMonth) {
      where.push({ NgayBD: Like(`${keyword}%`) });
      where.push({ NgayKT: Like(`${keyword}%`) });
    } else if (isYear) {
      where.push({ NgayBD: Like(`${keyword}%`) });
      where.push({ NgayKT: Like(`${keyword}%`) });
    }
    return await this.hopdongRepository.find({
      where,
    });
  }
}
