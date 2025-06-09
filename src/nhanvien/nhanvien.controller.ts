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
import { NhanvienService } from './nhanvien.service';
import { CreateNhanVienDTO } from './dto/create_nhanvien.dto';
import { UpdateNhanVienDTO } from './dto/update_nhanvien.dto';

@Controller('nhanvien')
export class NhanvienController {
  constructor(private nhanvienService: NhanvienService) {}

  @Get('')
  async getAll() {
    return await this.nhanvienService.getAllNhanVien();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string, @Query('type') type: string) {
    return await this.nhanvienService.searchNhanVien(keyword, type);
  }

  @Get(':manv')
  async getSV(@Param('manv') maNV: string) {
    return await this.nhanvienService.getNhanVien(maNV);
  }

  @Post('create')
  async create(@Body() dto: CreateNhanVienDTO, password?: string) {
    try {
      const res = await this.nhanvienService.createNhanvien(dto, password);
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

  @Put('update/:manv')
  async update(@Param('manv') maNV: string, @Body() dto: UpdateNhanVienDTO) {
    try {
      const res = this.nhanvienService.updateNhanVien(maNV, dto);
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

  @Put('approve/:manv')
  async approve(@Param('manv') maNV: string) {
    try {
      const res = this.nhanvienService.approvedNhanVien(maNV);
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

  @Put('cancel/:manv')
  async cancel(@Param('manv') maNV: string) {
    try {
      const res = this.nhanvienService.cancelledNhanVien(maNV);
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
