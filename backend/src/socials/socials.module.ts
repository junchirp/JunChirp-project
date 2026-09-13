import { Module } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { SocialsController } from './socials.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [SocialsController],
  providers: [SocialsService],
})
export class SocialsModule {}
