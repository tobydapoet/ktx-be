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
import { Roles } from 'src/account/roles.decorator';
import { Public } from 'src/account/public.decorator';

@Controller('vande')
export class VandeController {
  constructor(private readonly vandeService: VandeService) {}

  // Lấy tất cả hoặc theo mã sinh viên
  @Roles(0, 2)
  @Get('')
  async getAll(@Query('MaSV') maSV: string) {
    if (maSV) {
      return await this.vandeService.getVanDeByMaSV(maSV);
    }
    return await this.vandeService.getAllVanDe();
  }

  // Tìm kiếm toàn bộ dữ liệu (Admin hoặc Nhân viên)
  @Roles(0, 2)
  @Get('search')
  async search(@Query('keyword') keyword: string, @Query('type') type: string) {
    return await this.vandeService.searchVanDe(keyword, type);
  }

  // Tìm kiếm giới hạn theo sinh viên
  @Roles(0, 1, 2)
  @Get('searchsv')
  async searchByMaSV(
    @Query('MaSV') maSV: string,
    @Query('keyword') keyword: string,
    @Query('type') type: string,
  ) {
    return await this.vandeService.searchVanDeByMaSV(maSV, keyword, type);
  }

  // Lấy 1 vấn đề theo mã
  @Roles(0, 1, 2)
  @Get(':mavd')
  async getVD(@Param('mavd') maVD: number) {
    return await this.vandeService.getVanDe(maVD);
  }

  // Tạo mới
  @Roles(1)
  @Post('create')
  async create(@Body() dto: CreateVanDeDTO) {
    try {
      const res = await this.vandeService.createVanDe(dto);
      return { success: true, data: res };
    } catch (err) {
      throw new HttpException(
        { success: false, error: this.getErrorMessage(err) },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Cập nhật
  @Roles(0, 1, 2)
  @Put('update/:mavd')
  async update(@Param('mavd') maVD: number, @Body() dto: UpdateVanDeDTO) {
    try {
      const res = await this.vandeService.updateVanDe(maVD, dto);
      return { success: true, data: res };
    } catch (err) {
      throw new HttpException(
        { success: false, error: this.getErrorMessage(err) },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Xóa
  @Roles(0, 1, 2)
  @Delete('delete/:mavd')
  async delete(@Param('mavd') maVD: number) {
    try {
      const res = await this.vandeService.deleteVanDe(maVD);
      return { success: true, data: res };
    } catch (err) {
      throw new HttpException(
        { success: false, error: this.getErrorMessage(err) },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // lấy message lỗi
  private getErrorMessage(err: any): string {
    if (err && typeof err === 'object' && err !== null && 'message' in err) {
      return err.message;
    }
    return 'Lỗi không xác định';
  }
}
