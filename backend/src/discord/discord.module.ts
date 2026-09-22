import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordController } from './discord.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('Necord: before config');

        const token = configService.getOrThrow<string>('DISCORD_BOT_TOKEN');

        console.log('Necord: token loaded');

        return {
          token,
          intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
          ],
        };
      },
    }),
    LoggerModule,
  ],
  providers: [DiscordService],
  exports: [DiscordService],
  controllers: [DiscordController],
})
export class DiscordModule {}
