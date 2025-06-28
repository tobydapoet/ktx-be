import { Injectable } from '@nestjs/common';
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

  // Lấy tất cả hóa đơn (chỉ trạng thái hiển thị)
  async getAllHoaDon(maSV?: string): Promise<any[]> {
    let list;
    if (maSV) {
      // Nếu là sinh viên, chỉ lấy hóa đơn có sinh viên này
      const chiTietList = await this.chiTietHoaDonRepository.find({ where: { MaSV: maSV } });
      const maHDs = chiTietList.map(ct => ct.MaHD);
      list = await this.hoadonRepository.find({
        where: { MaHD: In(maHDs), TrangThai: 1 },
        relations: ['nhanvien'],
      });
    } else {
      // Quản lý, nhân viên: lấy toàn bộ
      list = await this.hoadonRepository.find({
        where: { TrangThai: 1 },
        relations: ['nhanvien'],
      });
    }
    return list.map(hd => ({
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
      // Không trả về phongs, chiTiet, các trường không cần thiết
    }));
  }

  // Lấy chi tiết hóa đơn (bao gồm chi tiết từng sinh viên)
  async getHoaDonWithChiTiet(maHD: string) {
    const hoadon = await this.hoadonRepository.findOne({ where: { MaHD: maHD }, relations: ['nhanvien'] });
    if (!hoadon) return null;
    // Chỉ lấy các trường cần thiết của nhân viên
    let nhanvien: any = undefined;
    if (hoadon.nhanvien) {
      nhanvien = {
        MaNV: hoadon.nhanvien.MaNV,
        TenNV: hoadon.nhanvien.TenNV
      };
    }
    const chiTiet = await this.chiTietHoaDonRepository.find({
      where: { MaHD: maHD },
      relations: ['sinhvien'],
    });
    return {
      ...hoadon,
      nhanvien,
      phongs: undefined, // Bỏ không trả về phongs
      chiTiet: chiTiet.map(ct => ({
        MaSV: ct.MaSV,
        TenSV: ct.sinhvien?.TenSV,
        TongTien: ct.TongTien,
        TrangThai: ct.TrangThai,
      })),
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
    return this.getHoaDonWithChiTiet(hoadon.MaHD!);
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
    return this.getHoaDonWithChiTiet(hoadon.MaHD!);
  }

  // Cập nhật hóa đơn
  async updateHoaDon(maHD: string, dto: Partial<UpdateHoaDonDTO>) {
    const existing = await this.hoadonRepository.findOne({ where: { MaHD: maHD } });
    if (!existing) throw new Error('Hóa đơn không tồn tại!');
    const result = this.hoadonRepository.merge(existing, {
      ...dto,
      NgayLap: dto.NgayLap ? new Date(dto.NgayLap) : existing.NgayLap,
      HanNop: dto.HanNop ? new Date(dto.HanNop) : existing.HanNop,
    });
    return await this.hoadonRepository.save(result);
  }

  // Cập nhật chi tiết hóa đơn, cho phép cập nhật số tiền và trạng thái
  async updateChiTietHoaDon(maHD: string, maSV: string, dto: UpdateChiTietHoaDonDTO) {
    const ct = await this.chiTietHoaDonRepository.findOne({ where: { MaHD: maHD, MaSV: maSV } });
    if (!ct) throw new Error('Chi tiết hóa đơn không tồn tại!');
    // Cho phép cập nhật cả số tiền và trạng thái nếu có
    const updateData: UpdateChiTietHoaDonDTO = { };
    if (typeof dto.TongTien === 'number') updateData.TongTien = dto.TongTien;
    if (typeof dto.TrangThai === 'number') updateData.TrangThai = dto.TrangThai;
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

  // Tìm kiếm hóa đơn
  async searchHoaDon(keyword: string) {
    const list = await this.hoadonRepository.find({
      where: [
        { MaHD: Like(`%${keyword}%`), TrangThai: 1 },
        { MaPhong: Like(`%${keyword}%`), TrangThai: 1 },
        { MaNV: Like(`%${keyword}%`), TrangThai: 1 },
      ],
      relations: ['nhanvien'],
    });
    return list.map(hd => ({
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
    }));
  }
}
