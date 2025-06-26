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
import { ThongbaoService } from './thongbao.service';
import { CreateThongBaoDTO } from './dto/create_thongbao.dto';
import { UpdateThongBaoDTO } from './dto/update_thongbao.dto';
import { Roles } from 'src/account/roles.decorator';
import { Public } from 'src/account/public.decorator';

@Controller('thongbao')
export class ThongbaoController {
  constructor(private thongBaoService: ThongbaoService) {}

  @Public()
  @Get()
  async getAll() {
    return await this.thongBaoService.getAllThongBao();
  }

  @Roles(0, 1, 2)
  @Get('search')
  async search(@Query('keyword') keyword: string, @Query('type') type: string) {
    return await this.thongBaoService.searchThongBao(keyword, type);
  }

  @Roles(0, 1, 2)
  @Get(':matb')
  async getTB(@Param('matb') maTB: number) {
    return await this.thongBaoService.getThongBao(maTB);
  }

  @Roles(0, 2)
  @Post('create')
  async create(@Body() dto: CreateThongBaoDTO) {
    try {
      const res = await this.thongBaoService.createThongBao(dto);
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
  @Put('update/:matb')
  async update(@Param('matb') maTB: number, @Body() dto: UpdateThongBaoDTO) {
    try {
      const res = await this.thongBaoService.updateThongBao(maTB, dto);
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
  @Delete('delete/:matb')
  async delete(@Param('matb') maTB: number) {
    try {
      const res = await this.thongBaoService.deleteThongBao(maTB);
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
