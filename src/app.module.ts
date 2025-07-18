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
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './account/roles.guard';
import { JwtAuthGuard } from './account/auth.guard';
import { AuthModule } from './auth/auth.module';
import { BlacklistModule } from './blacklist/blacklist.module';

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
    AuthModule,
    BlacklistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
