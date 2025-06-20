import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { HopdongService } from './hopdong.service';
import { CreateHopDongDto } from './dto/create_hopdong.dto';
import { UpdateHopDongDto } from './dto/update_hopdong.dto';

@Controller('hopdong')
export class HopdongController {
  constructor(private readonly hopdongService: HopdongService) {}

  @Post('Create')
  createHopDong(@Body() createHopDongDto: CreateHopDongDto) {
    return this.hopdongService.create(createHopDongDto);
  }

  @Get()
  findAll() {
    return this.hopdongService.findAll();
  }

  @Get('search')
  searchByKeyword(@Query('keyword') keyword: string) {
    return this.hopdongService.searchHopDong(keyword);
  }

  @Put(':MaHD')
  update(
    @Param('MaHD') MaHD: string,
    @Body() updateHopDongDto: UpdateHopDongDto,
  ) {
    return this.hopdongService.update(MaHD, updateHopDongDto);
  }

  @Delete(':MaHD')
  remove(@Param('MaHD') MaHD: string) {
    return this.hopdongService.remove(MaHD);
  }

  @Get(':MaHD')
  async getHopDong(@Param('MaHD') MaHD: string) {
    try {
      return await this.hopdongService.findOne(MaHD);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
