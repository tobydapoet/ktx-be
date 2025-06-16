import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    PassportModule,
    JwtModule.register({
      secret: 'KTX_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
})
export class AccountModule {}
