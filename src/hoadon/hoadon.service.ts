import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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
  async getAllHoaDon(): Promise<HoaDon[]> {
    return this.hoadonRepository.find({
      where: { TrangThai: 1 },
      relations: ['nhanvien', 'phongs'],
    });
  }

  // Lấy chi tiết hóa đơn (bao gồm chi tiết từng sinh viên)
  async getHoaDonWithChiTiet(maHD: string) {
    const hoadon = await this.hoadonRepository.findOne({ where: { MaHD: maHD }, relations: ['nhanvien', 'phongs'] });
    if (!hoadon) return null;
    const chiTiet = await this.chiTietHoaDonRepository.find({
      where: { MaHD: maHD },
      relations: ['sinhvien'],
    });
    return {
      ...hoadon,
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
    const hoadon = await this.hoadonRepository.save(dto);
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
    const hoadon = await this.hoadonRepository.save(dto.hoadon);
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
    const result = this.hoadonRepository.merge(existing, dto);
    return await this.hoadonRepository.save(result);
  }

  // Cập nhật chi tiết hóa đơn
  async updateChiTietHoaDon(maHD: string, maSV: string, dto: UpdateChiTietHoaDonDTO) {
    const ct = await this.chiTietHoaDonRepository.findOne({ where: { MaHD: maHD, MaSV: maSV } });
    if (!ct) throw new Error('Chi tiết hóa đơn không tồn tại!');
    const result = this.chiTietHoaDonRepository.merge(ct, dto);
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
    return await this.hoadonRepository.find({
      where: [
        { MaHD: Like(`%${keyword}%`), TrangThai: 1 },
        { MaPhong: Like(`%${keyword}%`), TrangThai: 1 },
        { MaNV: Like(`%${keyword}%`), TrangThai: 1 },
      ],
      relations: ['nhanvien', 'phongs'],
    });
  }
}
