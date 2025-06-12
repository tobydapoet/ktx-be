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
  async search(@Query('keyword') keyword: string) {
    return await this.nhanvienService.searchNhanVien(keyword);
  }

  @Get('user/:username')
  async getWithUser(@Param('username') username: string) {
    return await this.nhanvienService.getWithUserName(username);
  }

  @Get(':manv')
  async getSV(@Param('manv') maNV: string) {
    return await this.nhanvienService.getNhanVien(maNV);
  }

  @Post('create')
  async create(@Body() body: any) {
    const { Password, ...dto } = body;
    try {
      const res = await this.nhanvienService.createNhanvien(dto, Password);
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
  async update(@Param('manv') maNV: string, @Body() body: any) {
    try {
      const { Password, ...dto } = body;
      const res = await this.nhanvienService.updateNhanVien(
        maNV,
        dto,
        Password,
      );
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
      const res = await this.nhanvienService.approvedNhanVien(maNV);
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
      const res = await this.nhanvienService.cancelledNhanVien(maNV);
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
