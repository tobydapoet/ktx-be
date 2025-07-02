import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Blacklist } from 'src/blacklist/blacklist.entity';
import { BlacklistModule } from 'src/blacklist/blacklist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Blacklist]),
    forwardRef(() => BlacklistModule),
    PassportModule,
    JwtModule.register({
      secret: 'KTX_ACCESS_KEY',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
})
export class AccountModule {}
