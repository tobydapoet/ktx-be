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

@Controller('hoadon')
export class HoadonController {
  constructor(private hoadonService: HoadonService) {}

  @Get()
  async getAll(@Query('maSV') maSV?: string) {
    return await this.hoadonService.getAllHoaDon(maSV);
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.hoadonService.searchHoaDon(keyword);
  }

  @Get(':mahd')
  async getHD(@Param('mahd') maHD: string) {
    return await this.hoadonService.getHoaDonWithChiTiet(maHD);
  }

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

  @Put('update/:mahd')
  async update(@Param('mahd') maHD: string, @Body() dto: UpdateHoaDonDTO) {
    try {
      const res = await this.hoadonService.updateHoaDon(maHD, dto);
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

  @Post('update-sv-tien/:mahd')
  async updateSoTienSinhVien(@Param('mahd') maHD: string, @Body() svTien: Record<string, number>) {
    // svTien: { [MaSV]: TongTien }
    const promises = Object.entries(svTien).map(async ([maSV, tongTien]) => {
      return this.hoadonService.updateChiTietHoaDon(maHD, maSV, { TongTien: tongTien });
    });
    await Promise.all(promises);
    return { success: true };
  }

  @Post('thanhtoan-sinhvien/:mahd')
  async thanhToanSinhVien(@Param('mahd') maHD: string, @Body() body: { MaSV: string }) {
    await this.hoadonService.updateChiTietHoaDon(maHD, body.MaSV, { TrangThai: 1 });
    return { success: true };
  }
}
