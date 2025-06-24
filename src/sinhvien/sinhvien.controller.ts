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
import { Public } from 'src/account/public.decorator';

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

  @Public()
  @Get(':masv')
  async getSV(@Param('masv') maSV: string) {
    return await this.sinhvienService.getSinhVien(maSV);
  }

  @Public()
  @Get('user/:username')
  async getWithUser(@Param('username') username: string) {
    return await this.sinhvienService.getWithUserName(username);
  }

  @Public()
  @Get('/phong/:maphong')
  async getPhong(@Param('maphong') maPhong: string) {
    console.log('MaPhong nhận được:', maPhong);
    return await this.sinhvienService.getApproveSVInPhong(maPhong);
  }

  @Public()
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

  @Public()
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
