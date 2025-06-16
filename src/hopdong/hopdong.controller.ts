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
import { Roles } from 'src/account/roles.decorator';

@Controller('hopdong')
export class HopdongController {
  constructor(private readonly hopdongService: HopdongService) {}

  @Roles(0, 2)
  @Post('Create')
  createHopDong(@Body() createHopDongDto: CreateHopDongDto) {
    return this.hopdongService.create(createHopDongDto);
  }

  @Roles(0, 2)
  @Get()
  findAll() {
    return this.hopdongService.findAll();
  }

  @Roles(0, 2)
  @Get('search')
  searchByKeyword(@Query('keyword') keyword: string) {
    return this.hopdongService.searchHopDong(keyword);
  }

  @Roles(0, 2)
  @Put(':MaHD')
  update(
    @Param('MaHD') MaHD: string,
    @Body() updateHopDongDto: UpdateHopDongDto,
  ) {
    return this.hopdongService.update(MaHD, updateHopDongDto);
  }

  @Roles(0, 2)
  @Delete(':MaHD')
  remove(@Param('MaHD') MaHD: string) {
    return this.hopdongService.remove(MaHD);
  }

  @Roles(0, 2)
  @Get(':MaHD')
  async getHopDong(@Param('MaHD') MaHD: string) {
    try {
      return await this.hopdongService.findOne(MaHD);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
