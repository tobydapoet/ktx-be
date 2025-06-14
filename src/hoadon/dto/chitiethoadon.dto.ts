export class CreateChiTietHoaDonDTO {
  MaHD: string;
  MaSV: string;
  TongTien: number;
  TrangThai?: number; // 0: chưa thanh toán, 1: đã thanh toán, -1: quá hạn
}

export class UpdateChiTietHoaDonDTO {
  TongTien?: number;
  TrangThai?: number;
}
