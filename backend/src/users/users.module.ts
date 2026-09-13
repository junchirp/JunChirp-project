import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';
import { RolesModule } from '../roles/roles.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LoggerModule } from '../logger/logger.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [
    MailModule,
    RolesModule,
    CloudinaryModule,
    LoggerModule,
    DiscordModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
