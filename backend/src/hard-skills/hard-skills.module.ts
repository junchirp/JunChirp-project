import { Module } from '@nestjs/common';
import { HardSkillsService } from './hard-skills.service';
import { HardSkillsController } from './hard-skills.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [HardSkillsController],
  providers: [HardSkillsService],
})
export class HardSkillsModule {}
