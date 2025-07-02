import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { ChiTietHoaDon } from './chitiethoadon.entity';
import { CreateHoaDonDTO } from './dto/create_hoadon.dto';
import { UpdateHoaDonDTO } from './dto/update_hoadon.dto';
import { CreateChiTietHoaDonDTO, UpdateChiTietHoaDonDTO } from './dto/chitiethoadon.dto';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';

@Injectable()
export class HoadonService {
  constructor(
    @InjectRepository(HoaDon)
    private readonly hoadonRepository: Repository<HoaDon>,
    @InjectRepository(ChiTietHoaDon)
    private readonly chiTietHoaDonRepository: Repository<ChiTietHoaDon>,
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,
  ) {}

  // Gom logic map hóa đơn trả về
  private mapHoaDon(hd: HoaDon) {
    return {
      MaHD: hd.MaHD,
      SoDien: hd.SoDien,
      GiaDien: hd.GiaDien,
      SoNuoc: hd.SoNuoc,
      GiaNuoc: hd.GiaNuoc,
      GiaPhong: hd.GiaPhong,
      ChiPhiKhac: hd.ChiPhiKhac,
      MaPhong: hd.MaPhong,
      MaNV: hd.MaNV,
      NgayLap: hd.NgayLap,
      HanNop: hd.HanNop,
      nhanvien: hd.nhanvien ? { MaNV: hd.nhanvien.MaNV, TenNV: hd.nhanvien.TenNV } : undefined,
      chiTiet: hd.chiTiet ? hd.chiTiet.map((ct: any) => ({
        MaSV: ct.MaSV,
        TongTien: ct.TongTien,
        TrangThai: ct.TrangThai,
        TenSV: ct.sinhvien?.TenSV
      })) : [],
    };
  }

  // Lấy danh sách hóa đơn, hỗ trợ filter, phân trang, tìm kiếm
  async getAllHoaDon(query: {
    maSV?: string;
    keyword?: string;
    page?: number;
    limit?: number;
    maPhong?: string;
    tenSV?: string;
    trangThai?: number;
  } = {}): Promise<{ data: any[]; total: number }> {
    const {
      maSV,
      keyword = '',
      page = 1,
      limit = 20,
      maPhong,
      tenSV,
      trangThai = 1,
    } = query;
    const qb = this.hoadonRepository.createQueryBuilder('hd')
      .leftJoinAndSelect('hd.nhanvien', 'nhanvien')
      .leftJoinAndSelect('hd.chiTiet', 'chiTiet')
      .leftJoinAndSelect('chiTiet.sinhvien', 'svct');
    qb.where('hd.TrangThai = :trangThai', { trangThai });
    if (maSV) {
      qb.innerJoin('hd.chiTiet', 'ct', 'ct.MaSV = :maSV', { maSV });
    }
    if (maPhong) {
      qb.andWhere('hd.MaPhong = :maPhong', { maPhong });
    }

    // Nếu có keyword, tìm cả theo tên sinh viên (chuẩn hóa join, tránh xung đột alias)
    if (keyword) {
      qb.innerJoin('hd.chiTiet', 'ctkw')
        .innerJoin('ctkw.sinhvien', 'svkw');
      qb.andWhere(`(
        LOWER(svkw.TenSV) LIKE :kw
        OR hd.MaHD LIKE :kw2
        OR hd.MaPhong LIKE :kw2
        OR hd.MaNV LIKE :kw2
      )`, { kw: `%${keyword.toLowerCase()}%`, kw2: `%${keyword}%` });
    }

    if (tenSV) {
      qb.innerJoin('hd.chiTiet', 'ct2')
        .innerJoin('ct2.sinhvien', 'sv')
        .andWhere('LOWER(sv.TenSV) LIKE :tenSV', { tenSV: `%${tenSV.toLowerCase()}%` });
    }
    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    
    const today = new Date();
    const updatePromises: Promise<any>[] = [];
    data.forEach((hd: any) => {
      if (hd.chiTiet && Array.isArray(hd.chiTiet)) {
        hd.chiTiet.forEach((ct: any) => {
          if (ct.TrangThai === 0 && hd.HanNop && new Date(hd.HanNop) < today) {
            ct.TrangThai = -1; // -1: quá hạn
            updatePromises.push(
              this.chiTietHoaDonRepository.update({ MaHD: hd.MaHD, MaSV: ct.MaSV }, { TrangThai: -1 })
            );
          }
        });
      }
    });
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    return {
      data: data.map(this.mapHoaDon),
      total,
    };
    
  }



  // Tạo mới hóa đơn và tự động tạo chi tiết cho từng sinh viên trong phòng
  async createHoaDonAndAutoChiTiet(dto: CreateHoaDonDTO) {
    // Kiểm tra đã có hóa đơn của phòng này trong tháng này chưa
    const now = dto.NgayLap ? new Date(dto.NgayLap) : new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const existed = await this.hoadonRepository.createQueryBuilder('hd')
      .where('hd.MaPhong = :maPhong', { maPhong: dto.MaPhong })
      .andWhere('MONTH(hd.NgayLap) = :month', { month })
      .andWhere('YEAR(hd.NgayLap) = :year', { year })
      .andWhere('hd.TrangThai = 1')
      .getOne();
    if (existed) {
      throw new Error('Phòng này đã có hóa đơn trong tháng này!');
    }
    // Lấy mã hóa đơn lớn nhất hiện có
    const lastHD = await this.hoadonRepository.find({
      order: { MaHD: 'DESC' },
      take: 1,
      select: ['MaHD'],
    });
    let newNumber = 1;
    if (lastHD.length > 0 && lastHD[0].MaHD) {
      const match = lastHD[0].MaHD.match(/HD(\d+)/);
      if (match) {
        newNumber = parseInt(match[1], 10) + 1;
      }
    }
    const newMaHD = `HD${newNumber.toString().padStart(2, '0')}`;
    const hoaDonEntity = this.hoadonRepository.create({
      ...dto,
      MaHD: newMaHD,
      NgayLap: dto.NgayLap ? new Date(dto.NgayLap) : new Date(),
      HanNop: dto.HanNop ? new Date(dto.HanNop) : undefined,
    });
    const hoadon = await this.hoadonRepository.save(hoaDonEntity);
    const sinhViens = await this.sinhVienRepository.find({ where: { MaPhong: dto.MaPhong } });
    if (!sinhViens || sinhViens.length === 0) throw new Error('Không có sinh viên nào trong phòng này!');
    const tongTien = dto.GiaPhong + (dto.SoDien * dto.GiaDien) + (dto.SoNuoc * dto.GiaNuoc) + (dto.ChiPhiKhac || 0);
    const soSV = sinhViens.length;
    const tienMoiSV = Math.round(tongTien / soSV);
    const chiTietArr = sinhViens.map(sv => this.chiTietHoaDonRepository.create({
      MaHD: hoadon.MaHD,
      MaSV: sv.MaSV,
      TongTien: tienMoiSV,
      TrangThai: 0,
    }));
    await this.chiTietHoaDonRepository.save(chiTietArr);
    return hoadon;
  }

  // Tạo mới hóa đơn và chi tiết thủ công
  async createHoaDonWithChiTiet(dto: { hoadon: CreateHoaDonDTO, chiTiet: CreateChiTietHoaDonDTO[] }) {
    const hoaDonEntity = this.hoadonRepository.create({
      ...dto.hoadon,
      NgayLap: dto.hoadon.NgayLap ? new Date(dto.hoadon.NgayLap) : new Date(),
      HanNop: dto.hoadon.HanNop ? new Date(dto.hoadon.HanNop) : undefined,
    });
    const hoadon = await this.hoadonRepository.save(hoaDonEntity);
    const chiTietArr = dto.chiTiet.map(ct => this.chiTietHoaDonRepository.create({
      ...ct,
      MaHD: hoadon.MaHD,
      TrangThai: ct.TrangThai ?? 0,
    }));
    await this.chiTietHoaDonRepository.save(chiTietArr);
    return hoadon;
  }

  // Cập nhật hóa đơn
  async updateHoaDon(maHD: string, dto: Partial<UpdateHoaDonDTO>) {
    const existing = await this.hoadonRepository.findOne({ where: { MaHD: maHD } });
    if (!existing) throw new Error('Hóa đơn không tồn tại!');

    // Frontend không gửi NgayLap, nên luôn giữ nguyên ngày lập cũ
    const newNgayLap: Date = existing.NgayLap || new Date();
    const newMaPhong = dto.MaPhong || existing.MaPhong;
    
    // Chỉ kiểm tra trùng nếu đổi phòng (vì NgayLap không thay đổi)
    if (newMaPhong !== existing.MaPhong) {
      const month = newNgayLap.getMonth() + 1;
      const year = newNgayLap.getFullYear();
      
      const existed = await this.hoadonRepository.createQueryBuilder('hd')
        .where('hd.MaPhong = :maPhong', { maPhong: newMaPhong })
        .andWhere('MONTH(hd.NgayLap) = :month', { month })
        .andWhere('YEAR(hd.NgayLap) = :year', { year })
        .andWhere('hd.TrangThai = 1')
        .andWhere('hd.MaHD != :maHD', { maHD }) // Loại trừ hóa đơn hiện tại
        .getOne();
      if (existed) {
        throw new Error('Phòng này đã có hóa đơn trong tháng này!');
      }
    }
    
    const result = this.hoadonRepository.merge(existing, {
      ...dto,
      NgayLap: newNgayLap, // Luôn giữ nguyên ngày lập cũ
      HanNop: dto.HanNop ? new Date(dto.HanNop) : existing.HanNop,
    });
    return await this.hoadonRepository.save(result);
  }

  // Cập nhật chi tiết hóa đơn, cho phép cập nhật số tiền và trạng thái
  async updateChiTietHoaDon(trangthai: number, maHD: string, maSV: string, dto: UpdateChiTietHoaDonDTO) {
    const ct = await this.chiTietHoaDonRepository.findOne({ where: { MaHD: maHD, MaSV: maSV } });
    if (!ct) throw new Error('Chi tiết hóa đơn không tồn tại!');
    const updateData: UpdateChiTietHoaDonDTO = { };
    if (trangthai === 1) {
      if (typeof dto.TrangThai === 'number') updateData.TrangThai = dto.TrangThai;
      if (dto.TongTien) throw new Error('bạn không có quyền cập nhật số tiền');
    } else { 
      if (typeof dto.TongTien === 'number') updateData.TongTien = dto.TongTien;
      if (typeof dto.TrangThai === 'number') updateData.TrangThai = dto.TrangThai;
    }
    const result = this.chiTietHoaDonRepository.merge(ct, updateData);
    return await this.chiTietHoaDonRepository.save(result);
  }

  // Xóa mềm hóa đơn
  async softDeleteHoaDon(maHD: string) {
    const hd = await this.hoadonRepository.findOne({ where: { MaHD: maHD } });
    if (!hd) return null;
    hd.TrangThai = 0;
    await this.hoadonRepository.save(hd);
    return hd;
  }

  async searchHoaDon(query: {
    keyword?: string;
    maSV?: string;
    maPhong?: string;
    tenSV?: string;
    page?: number;
    limit?: number;
    trangThai?: number;
  }) {
    return this.getAllHoaDon(query);
  }
}
