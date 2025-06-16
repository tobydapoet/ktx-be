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
import { PhongService } from './phong.service';
import { UpdatePhongDTO } from './dto/update_phong.dto';
import { CreatePhongDTO } from './dto/create_phong.dto';
import { Roles } from 'src/account/roles.decorator';

@Controller('phong')
export class PhongController {
  constructor(private readonly phongService: PhongService) {}

  @Get('')
  async getAll() {
    return this.phongService.getAllPhong();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.phongService.searchPhong(keyword);
  }

  @Get(':maphong')
  async getPhong(@Param('maphong') maPhong: string) {
    return this.phongService.getPhong(maPhong);
  }

  @Roles(0, 2)
  @Post('create')
  async create(@Body() dto: CreatePhongDTO) {
    try {
      const res = await this.phongService.createPhong(dto);
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
  @Put('update/:maphong')
  async update(@Param('maphong') maPhong: string, @Body() dto: UpdatePhongDTO) {
    try {
      const res = await this.phongService.updatePhong(maPhong, dto);
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
  @Put('approve/:maphong')
  async approve(@Param('maphong') maPhong: string) {
    try {
      const res = await this.phongService.approvedPhong(maPhong);
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
  @Put('cancel/:maphong')
  async cancel(@Param('maphong') maPhong: string) {
    try {
      const res = await this.phongService.cancelledPhong(maPhong);
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
