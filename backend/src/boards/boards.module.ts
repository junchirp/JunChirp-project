import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { DiscordModule } from '../discord/discord.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DiscordModule, ProjectsModule],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
