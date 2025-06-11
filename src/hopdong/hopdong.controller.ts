import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { HopdongService } from './hopdong.service';
import { CreateHopDongDto } from './dto/create_hopdong.dto';
import { UpdateHopDongDto } from './dto/update_hopdong.dto';

@Controller('hopdong')
export class HopdongController {
  constructor(private readonly hopdongService: HopdongService) {}

  @Post()
  create(@Body() createHopDongDto: CreateHopDongDto) {
    return this.hopdongService.create(createHopDongDto);
  }

  @Get()
  findAll() {
    return this.hopdongService.findAll();
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

  @Get('search')
  search(
    @Query('MaHD') MaHD?: string,
    @Query('MaPhong') MaPhong?: string,
    @Query('MaSV') MaSV?: string,
    @Query('MaNV') MaNV?: string,
    @Query('Thang') Thang?: string,
  ) {
    return this.hopdongService.search({ MaHD, MaPhong, MaSV, MaNV, Thang });
  }
}
