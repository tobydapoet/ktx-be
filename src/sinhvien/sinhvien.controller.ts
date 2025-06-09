import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SinhvienService } from './sinhvien.service';
import { CreateSinhVienDTO } from './dto/create_sinhvien.dto';
import { UpdateSinhVienDTO } from './dto/update_sinhvien.dto';

@Controller('sinhvien')
export class SinhvienController {
  constructor(private sinhvienService: SinhvienService) {}

  @Get('')
  async getAll() {
    return await this.sinhvienService.getAllSinhVien();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string, @Query('type') type: string) {
    return await this.sinhvienService.searchSinhVien(keyword, type);
  }

  @Get(':masv')
  async getSV(@Param('masv') maSV: string) {
    return await this.sinhvienService.getSinhVien(maSV);
  }

  @Post('create')
  async create(@Body() dto: CreateSinhVienDTO, password?: string) {
    try {
      const res = await this.sinhvienService.createSinhVien(dto, password);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          success: false,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update/:masv')
  async update(@Param('masv') maSV: string, @Body() dto: UpdateSinhVienDTO) {
    try {
      const res = this.sinhvienService.updateSinhVien(maSV, dto);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          success: false,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('approve/:masv')
  async approve(@Param('masv') maSV: string) {
    try {
      const res = this.sinhvienService.approvedSinhVien(maSV);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          success: false,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('cancel/:masv')
  async cancel(@Param('masv') maSV: string) {
    try {
      const res = this.sinhvienService.cancelledSinhVien(maSV);
      if (res) {
        return {
          success: true,
          data: res,
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          success: false,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
