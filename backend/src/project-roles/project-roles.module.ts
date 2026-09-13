import { Module } from '@nestjs/common';
import { ProjectRolesService } from './project-roles.service';
import { ProjectRolesController } from './project-roles.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [ProjectRolesController],
  providers: [ProjectRolesService],
  exports: [ProjectRolesService],
})
export class ProjectRolesModule {}
