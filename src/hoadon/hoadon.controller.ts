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
import { Request } from '@nestjs/common';
import { SinhvienService } from 'src/sinhvien/sinhvien.service';


@Controller('hoadon')
export class HoadonController {
  constructor(
    private hoadonService: HoadonService,
    private sinhvienService: SinhvienService,
  ) {}

  @Get()
  @Roles(0, 1, 2)
  async getAll(@Query() query: any, @Request() req) {
    const user = req.user; 
    if (user.ChucVu === 1) {   
      const sinhvien = await this.sinhvienService.getWithUserName(user.Username);
      if (!sinhvien) {
        throw new HttpException('Không tìm thấy thông tin sinh viên', HttpStatus.NOT_FOUND);
      }
      query.maSV = sinhvien.MaSV; 
    }
    return await this.hoadonService.getAllHoaDon(query);
  }
  

  @Get('search')
  @Roles(0, 1, 2)
  async search(@Query() query: any, @Request() req) {
    const user = req.user; 
    if (user.ChucVu === 1) { 
      const sinhvien = await this.sinhvienService.getWithUserName(user.Username);
      if (!sinhvien) {
        throw new HttpException('Không tìm thấy thông tin sinh viên', HttpStatus.NOT_FOUND);
      }
      query.maSV = sinhvien.MaSV; 
    }
    return await this.hoadonService.searchHoaDon(query);
  }



  @Post()
  @Roles(0, 2)
  async create(@Body() dto: CreateHoaDonDTO) {
    try {
      const res = await this.hoadonService.createHoaDonAndAutoChiTiet(dto);
      return { success: true, data: res };
    } catch (err) {
      throw new HttpException(
        { success: false, error: err.message || 'Có lỗi xảy ra' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':maHD')
  @Roles(0, 2)
  async update(@Param('maHD') maHD: string, @Body() dto: UpdateHoaDonDTO) {
    try {
      const res = await this.hoadonService.updateHoaDon(maHD, dto);
      return { success: true, data: res };
    } catch (err) {
      throw new HttpException(
        { success: false, error: err.message || 'Có lỗi xảy ra' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':maHD')
  @Roles(0, 2)
  async remove(@Param('maHD') maHD: string) {
    const res = await this.hoadonService.softDeleteHoaDon(maHD);
    return { success: !!res, data: res };
  }

  @Put(':maHD/chitiet/:maSV')
  @Roles(0, 2,1)
  async updateChiTiet(
    @Param('maHD') maHD: string,
    @Param('maSV') maSV: string,
    @Body() dto: any,
    @Request() req
  ) {
    const user = req.user;
    if (user.ChucVu === 1) {
      const sinhvien = await this.sinhvienService.getWithUserName(user.Username);
      if (!sinhvien) {
        throw new HttpException('Không tìm thấy thông tin sinh viên', HttpStatus.NOT_FOUND);
      }
      if (maSV !== sinhvien.MaSV) {
        throw new HttpException('Bạn chỉ có thể cập nhật thông tin của chính mình', HttpStatus.FORBIDDEN);
      }
    }
    const res = await this.hoadonService.updateChiTietHoaDon(user.ChucVu, maHD, maSV, dto);
    return { success: true, data: res };
  }
}
