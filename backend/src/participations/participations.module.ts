import { Module } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from '../discord/discord.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MailModule, ConfigModule, DiscordModule, UsersModule],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
