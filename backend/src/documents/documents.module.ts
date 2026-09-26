import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DiscordModule } from '../discord/discord.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DiscordModule, ProjectsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
