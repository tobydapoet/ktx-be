import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VandeService } from './vande.service';
import { CreateVanDeDTO, UpdateVanDeDTO } from './dto/vande.dto';

@Controller('vande')
export class VandeController {
  constructor(private readonly vandeService: VandeService) {}

  @Get('')
  async getAll() {
    return await this.vandeService.getAllVanDe();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.vandeService.searchVanDe(keyword);
  }

  @Get(':mavd')
  async getVD(@Param('mavd') maVD: number) {
    return await this.vandeService.getVanDe(maVD);
  }

  @Post('create')
  async create(@Body() dto: CreateVanDeDTO) {
    try {
      const res = await this.vandeService.createVanDe(dto);
      return { success: true, data: res };
    } catch (err) {
      let message = 'Lỗi không xác định';
      if (err && typeof err === 'object' && err !== null) {
        if (Object.prototype.hasOwnProperty.call(err, 'message')) {
          message = (err as { message: string }).message;
        }
      }
      throw new HttpException(
        { success: false, error: message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update/:mavd')
  async update(@Param('mavd') maVD: number, @Body() dto: UpdateVanDeDTO) {
    try {
      const res = await this.vandeService.updateVanDe(maVD, dto);
      return { success: true, data: res };
    } catch (err) {
      let message = 'Lỗi không xác định';
      if (err && typeof err === 'object' && err !== null) {
        if (Object.prototype.hasOwnProperty.call(err, 'message')) {
          message = (err as { message: string }).message;
        }
      }
      throw new HttpException(
        { success: false, error: message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete/:mavd')
  async delete(@Param('mavd') maVD: number) {
    try {
      const res = await this.vandeService.deleteVanDe(maVD);
      return { success: true, data: res };
    } catch (err) {
      let message = 'Lỗi không xác định';
      if (err && typeof err === 'object' && err !== null) {
        if (Object.prototype.hasOwnProperty.call(err, 'message')) {
          message = (err as { message: string }).message;
        }
      }
      throw new HttpException(
        { success: false, error: message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
