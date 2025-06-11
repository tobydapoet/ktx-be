import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async search(query: {
    MaHD?: string;
    MaPhong?: string;
    MaSV?: string;
    MaNV?: string;
    Thang?: string;
    Nam?: string;
    thang?: string;
    nam?: string;
  }): Promise<HopDong[]> {
    // Hỗ trợ cả query string chữ thường và chữ hoa
    const Thang = query.Thang || query.thang;
    const Nam = query.Nam || query.nam;
    const qb = this.hopdongRepository.createQueryBuilder('hopdong');
    let hasCondition = false;
    if (query.MaHD) {
      qb.andWhere('hopdong.MaHD = :MaHD', { MaHD: query.MaHD });
      hasCondition = true;
    }
    if (query.MaPhong) {
      qb.andWhere('hopdong.MaPhong = :MaPhong', { MaPhong: query.MaPhong });
      hasCondition = true;
    }
    if (query.MaSV) {
      qb.andWhere('hopdong.MaSV = :MaSV', { MaSV: query.MaSV });
      hasCondition = true;
    }
    if (query.MaNV) {
      qb.andWhere('hopdong.MaNV = :MaNV', { MaNV: query.MaNV });
      hasCondition = true;
    }
    if (Thang && Nam) {
      qb.andWhere(
        'MONTH(hopdong.NgayBD) = :Thang AND YEAR(hopdong.NgayBD) = :Nam',
        { Thang, Nam },
      );
      hasCondition = true;
    } else if (Thang) {
      qb.andWhere('MONTH(hopdong.NgayBD) = :Thang', { Thang });
      hasCondition = true;
    } else if (Nam) {
      qb.andWhere('YEAR(hopdong.NgayBD) = :Nam', { Nam });
      hasCondition = true;
    }
    const result = await qb.getMany();
    if (query.MaHD && result.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy hợp đồng với MaHD: ' + query.MaHD,
      );
    }
    if ((Thang || Nam) && result.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy hợp đồng với tháng/năm yêu cầu!',
      );
    }
    if (!hasCondition) {
      return this.hopdongRepository.find();
    }
    return result;
  }
}
