import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('DISCORD_BOT_TOKEN'),
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMembers,
        ],
      }),
    }),
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
