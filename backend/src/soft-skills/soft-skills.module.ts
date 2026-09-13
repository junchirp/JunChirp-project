import { Module } from '@nestjs/common';
import { SoftSkillsService } from './soft-skills.service';
import { SoftSkillsController } from './soft-skills.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [SoftSkillsController],
  providers: [SoftSkillsService],
})
export class SoftSkillsModule {}
