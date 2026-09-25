import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProjectRolesModule } from '../project-roles/project-roles.module';
import { DiscordModule } from '../discord/discord.module';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    CloudinaryModule,
    ProjectRolesModule,
    DiscordModule,
    UsersModule,
    LoggerModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
