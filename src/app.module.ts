import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SinhvienModule } from './sinhvien/sinhvien.module';
import { NhanvienModule } from './nhanvien/nhanvien.module';
import { VandeModule } from './vande/vande.module';
import { ThongbaoModule } from './thongbao/thongbao.module';
import { PhongModule } from './phong/phong.module';
import { HoadonModule } from './hoadon/hoadon.module';
import { HopdongModule } from './hopdong/hopdong.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ktxx',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SinhvienModule,
    NhanvienModule,
    VandeModule,
    ThongbaoModule,
    PhongModule,
    HoadonModule,
    HopdongModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
