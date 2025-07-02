import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HoadonService } from './hoadon.service';
import { CreateHoaDonDTO } from './dto/create_hoadon.dto';
import { UpdateHoaDonDTO } from './dto/update_hoadon.dto';
import { Roles } from 'src/account/roles.decorator';
import { Public } from 'src/account/public.decorator';


@Controller('hoadon')
export class HoadonController {
  constructor(
    private hoadonService: HoadonService,
  ) {}

  @Get('')
  @Roles(0, 1, 2)
  async getAll(@Query('maSV') maSV?: string) {
    return await this.hoadonService.getAllHoaDon(maSV);
  }

  @Roles(0, 1, 2)
  @Get('search')
  async search(@Query('keyword') keyword: string, @Query('maSV') maSV?: string) {
    return await this.hoadonService.searchHoaDon(keyword, maSV);
  }

  @Roles(0, 1, 2)
  @Get(':mahd')
  async getHD(@Param('mahd') maHD: string) {
    return await this.hoadonService.getHoaDonWithChiTiet(maHD);
  }

  @Roles(0, 2)
  @Post('create')
  async create(@Body() dto: CreateHoaDonDTO) {
    try {
      const res = await this.hoadonService.createHoaDonAndAutoChiTiet(dto);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      let errorMsg = 'Có lỗi xảy ra';
      if (err && typeof err === 'object' && err !== null && 'message' in err) {
        errorMsg = String((err as { message?: unknown }).message);
      }
      throw new HttpException(
        {
          success: false,
          error: errorMsg,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(0, 2, 1)
  @Put('update/:mahd')
  async update(@Param('mahd') maHD: string, @Body() dto: UpdateHoaDonDTO) {
    try {
      console.log('=== DEBUG UPDATE HOADON ===');
      console.log('MaHD:', maHD);
      console.log('DTO received:', dto);
      console.log('DTO type check:', {
        SoDien: typeof dto.SoDien,
        GiaDien: typeof dto.GiaDien,
        SoNuoc: typeof dto.SoNuoc,
        GiaNuoc: typeof dto.GiaNuoc,
        GiaPhong: typeof dto.GiaPhong,
        MaPhong: typeof dto.MaPhong,
        MaNV: typeof dto.MaNV,
        NgayLap: typeof dto.NgayLap,
      });
      
      const res = await this.hoadonService.updateHoaDon(maHD, dto);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      console.log('=== ERROR IN UPDATE ===');
      console.log('Error:', err);
      let errorMsg = 'Có lỗi xảy ra';
      if (err && typeof err === 'object' && err !== null && 'message' in err) {
        errorMsg = String((err as { message?: unknown }).message);
      }
      throw new HttpException(
        {
          success: false,
          error: errorMsg,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(0, 2)
  @Delete('delete/:mahd')
  async delete(@Param('mahd') maHD: string) {
    try {
      const res = await this.hoadonService.softDeleteHoaDon(maHD);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      let errorMsg = 'Có lỗi xảy ra';
      if (err && typeof err === 'object' && err !== null && 'message' in err) {
        errorMsg = String((err as { message?: unknown }).message);
      }
      throw new HttpException(
        {
          success: false,
          error: errorMsg,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles(0, 2)
  @Post('update-sv-tien/:mahd')
  async updateSoTienSinhVien(
    @Param('mahd') maHD: string,
    @Body() svTien: Record<string, number>,
  ) {
    // svTien: { [MaSV]: TongTien }
    const promises = Object.entries(svTien).map(async ([maSV, tongTien]) => {
      return this.hoadonService.updateChiTietHoaDon(maHD, maSV, {
        TongTien: tongTien,
      });
    });
    await Promise.all(promises);
    return { success: true };
  }

  @Roles(1)
  @Post('thanhtoan-sinhvien/:mahd')
  async thanhToanSinhVien(
    @Param('mahd') maHD: string,
    @Body() body: { MaSV: string },
  ) {
    await this.hoadonService.updateChiTietHoaDon(maHD, body.MaSV, {
      TrangThai: 1,
    });
    return { success: true };
  }
}
