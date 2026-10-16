import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { DiscordModule } from '../discord/discord.module';
import { BoardsGateway } from './boards.gateway';
import { CookieConfigModule } from '../cookie-config/cookie-config.module';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DiscordModule,
    CookieConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsGateway],
  exports: [BoardsService, BoardsGateway],
})
export class BoardsModule {}
