import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DiscordModule } from '../discord/discord.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DiscordModule, ProjectsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
