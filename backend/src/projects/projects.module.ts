import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProjectRolesModule } from '../project-roles/project-roles.module';
import { DiscordModule } from '../discord/discord.module';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from '../logger/logger.module';
import { ProjectsGateway } from './projects.gateway';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieConfigModule } from '../cookie-config/cookie-config.module';

@Module({
  imports: [
    CloudinaryModule,
    ProjectRolesModule,
    DiscordModule,
    UsersModule,
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    CookieConfigModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsGateway],
  exports: [ProjectsService, ProjectsGateway],
})
export class ProjectsModule {}
