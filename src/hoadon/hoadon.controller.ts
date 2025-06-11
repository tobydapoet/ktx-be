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
  async getAll() {
    return await this.hoadonService.getAllHoaDon();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.hoadonService.searchHoaDon(keyword);
  }

  @Get(':mahd')
  async getHD(@Param('mahd') maHD: string) {
    return await this.hoadonService.getHoaDon(maHD);
  }

  @Post('create')
  async create(@Body() dto: CreateHoaDonDTO) {
    try {
      const res = await this.hoadonService.createHoaDon(dto);
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
      const res = await this.hoadonService.deleteHoaDon(maHD);
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
}
