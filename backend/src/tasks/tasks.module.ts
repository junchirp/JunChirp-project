import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DiscordModule } from '../discord/discord.module';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [DiscordModule, BoardsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
