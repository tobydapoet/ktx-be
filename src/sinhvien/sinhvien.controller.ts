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
import { Roles } from 'src/account/roles.decorator';

@Controller('sinhvien')
export class SinhvienController {
  constructor(private sinhvienService: SinhvienService) {}

  @Roles(0, 2)
  @Get('')
  async getAll() {
    return await this.sinhvienService.getAllSinhVien();
  }

  @Roles(0, 2)
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.sinhvienService.searchSinhVien(keyword);
  }

  @Roles(0, 1, 2)
  @Get(':masv')
  async getSV(@Param('masv') maSV: string) {
    return await this.sinhvienService.getSinhVien(maSV);
  }

  @Roles(0, 1, 2)
  @Get('user/:username')
  async getWithUser(@Param('username') username: string) {
    return await this.sinhvienService.getWithUserName(username);
  }

  @Roles(0, 1, 2)
  @Get('/phong/:maphong')
  async getPhong(@Param('maphong') maPhong: string) {
    return await this.sinhvienService.getApproveSVInPhong(maPhong);
  }

  @Roles(0, 1, 2)
  @Post('create')
  async create(@Body() body: any) {
    const { Password, ...dto } = body;
    try {
      const res = await this.sinhvienService.createSinhVien(dto, Password);

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

  @Roles(0, 1, 2)
  @Put('update/:masv')
  async update(@Param('masv') maSV: string, @Body() body: any) {
    try {
      const { Password, ...dto } = body;
      const res = await this.sinhvienService.updateSinhVien(
        maSV,
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

  @Roles(0, 2)
  @Put('approve/:masv')
  async approve(@Param('masv') maSV: string) {
    try {
      const res = await this.sinhvienService.approvedSinhVien(maSV);
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

  @Roles(0, 2)
  @Put('cancel/:masv')
  async cancel(@Param('masv') maSV: string) {
    try {
      const res = await this.sinhvienService.cancelledSinhVien(maSV);
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
