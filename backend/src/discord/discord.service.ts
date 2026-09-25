import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ChannelType,
  Client,
  DiscordAPIError,
  Guild,
  PermissionResolvable,
  Role,
  TextChannel,
} from 'discord.js';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Once } from 'necord';
import { PrismaService } from '../prisma/prisma.service';
import { isPrismaError } from '../common/utils/is-prisma-error';
import { LoggerService } from '../logger/logger.service';
import { LogEventType } from '@prisma/client';

@Injectable()
export class DiscordService {
  private readonly guildId: string;

  private readonly botToken: string;

  private guild!: Guild;

  public constructor(
    private readonly configService: ConfigService,
    private readonly client: Client,
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.guildId = this.configService.get<string>('DISCORD_GUILD_ID') as string;

    this.botToken = this.configService.get<string>(
      'DISCORD_BOT_TOKEN',
    ) as string;
  }

  @Once('clientReady')
  public async onReady(): Promise<void> {
    this.guild = await this.client.guilds.fetch(this.guildId);

    await this.guild.roles.fetch();
    await this.guild.channels.fetch();
  }
  // TODO: uncomment event before release
  // @On('guildMemberAdd')
  // public async onGuildMemberAdd(member: GuildMember): Promise<void> {
  //   if (member.guild.id !== this.guildId) {
  //     return;
  //   }
  //
  //   const user = await this.prisma.user.findFirst({ // TODO: change to 'findUnique' before release
  //     where: { discordId: member.id },
  //     select: { id: true },
  //   });
  //
  //   if (!user) {
  //     return;
  //   }
  //
  //   await this.restoreProjectRoles(user.id, member.id);
  // }

  public async createProjectChannel(projectName: string): Promise<{
    channelId: string;
    adminRoleId: string;
    memberRoleId: string;
  }> {
    const adminPermissions: PermissionResolvable[] = [
      'ViewChannel',
      'SendMessages',
      'ManageMessages',
      'MentionEveryone',
      'AddReactions',
      'EmbedLinks',
      'AttachFiles',
      'UseExternalEmojis',
      'ReadMessageHistory',
      'ManageThreads',
      'SendMessagesInThreads',
      'UseApplicationCommands',
    ];

    const memberPermissions: PermissionResolvable[] = [
      'ViewChannel',
      'SendMessages',
      'AddReactions',
      'EmbedLinks',
      'AttachFiles',
      'UseExternalEmojis',
      'ReadMessageHistory',
      'SendMessagesInThreads',
      'UseApplicationCommands',
    ];

    const botPermissions: PermissionResolvable[] = ['Administrator'];

    let adminRole: Role | undefined;
    let memberRole: Role | undefined;
    let channel: TextChannel | undefined;

    try {
      adminRole = await this.guild.roles.create({
        name: `${projectName}_admin`,
        permissions: adminPermissions,
      });

      memberRole = await this.guild.roles.create({
        name: `${projectName}_member`,
        permissions: memberPermissions,
      });

      const botRole = this.guild.roles.cache.find(
        (role) => role.name === 'JunChirp',
      );

      if (!botRole) {
        throw new Error('Bot role "JunChirp" not found');
      }

      const createdChannel = await this.guild.channels.create({
        name: projectName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: this.guild.roles.everyone,
            deny: ['ViewChannel'],
          },
          {
            id: adminRole.id,
            allow: adminPermissions,
          },
          {
            id: memberRole.id,
            allow: memberPermissions,
          },
          {
            id: botRole.id,
            allow: botPermissions,
          },
        ],
      });

      if (!(createdChannel instanceof TextChannel)) {
        throw new Error('Created project channel has invalid type');
      }

      channel = createdChannel;

      return {
        channelId: channel.id,
        adminRoleId: adminRole.id,
        memberRoleId: memberRole.id,
      };
    } catch (error) {
      await Promise.allSettled([
        channel?.delete(),
        memberRole?.delete(),
        adminRole?.delete(),
      ]);

      throw error;
    }
  }

  public async restoreProjectRoles(
    userId: string,
    discordId: string,
  ): Promise<void> {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            roles: {
              some: {
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        ownerId: true,
        discordAdminRoleId: true,
        discordMemberRoleId: true,
        roles: {
          where: {
            users: {
              some: {
                id: userId,
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    for (const project of projects) {
      if (project.ownerId === userId) {
        await this.addRoleToUser(discordId, project.discordAdminRoleId);
      }

      if (project.roles.length > 0) {
        await this.addRoleToUser(discordId, project.discordMemberRoleId);
      }
    }
  }

  public async addRoleToUser(
    userDiscordId: string,
    roleId: string,
  ): Promise<void> {
    const member = await this.guild.members.fetch(userDiscordId);
    await member.roles.add(roleId);
  }

  public async removeRoleFromUser(
    userDiscordId: string,
    roleId: string,
  ): Promise<void> {
    const member = await this.guild.members.fetch(userDiscordId);
    await member.roles.remove(roleId);
  }

  public async deleteProjectChannel(
    discordChannelId: string,
    discordAdminRoleId: string,
    discordMemberRoleId: string,
  ): Promise<void> {
    await Promise.allSettled([
      (async (): Promise<void> => {
        const channel = await this.guild.channels.fetch(discordChannelId);

        if (channel) {
          await channel.delete();
        }
      })(),

      (async (): Promise<void> => {
        const adminRole = await this.guild.roles.fetch(discordAdminRoleId);

        if (adminRole) {
          await adminRole.delete();
        }
      })(),

      (async (): Promise<void> => {
        const memberRole = await this.guild.roles.fetch(discordMemberRoleId);

        if (memberRole) {
          await memberRole.delete();
        }
      })(),
    ]);
  }

  public async addToGuild(
    discordId: string,
    accessToken: string,
  ): Promise<void> {
    try {
      const url = `https://discord.com/api/v10/guilds/${this.guildId}/members/${discordId}`;

      await axios.put(
        url,
        {
          access_token: accessToken,
        },
        {
          headers: {
            Authorization: `Bot ${this.botToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async renameProjectChannel(
    channelId: string,
    projectName: string,
  ): Promise<void> {
    const channel = await this.guild.channels.fetch(channelId);

    if (!(channel instanceof TextChannel)) {
      throw new Error('Invalid channel type');
    }

    await channel.edit({
      name: projectName,
    });
  }

  public async userExists(userId: string, discordId: string): Promise<boolean> {
    try {
      await this.client.users.fetch(discordId);
      return true;
    } catch (error) {
      if (!(error instanceof DiscordAPIError) || error.code !== 10013) {
        throw error;
      }

      try {
        await this.prisma.user.update({
          where: {
            id: userId,
            discordId,
          },
          data: {
            discordId: null,
          },
        });
      } catch (e) {
        if (isPrismaError(e) && e.code === 'P2025') {
          return false;
        }
        throw e;
      }
      return false;
    }
  }

  public getGuildId(): string {
    return this.guildId;
  }

  public async isGuildMember(discordId: string): Promise<boolean> {
    try {
      await this.guild.members.fetch(discordId);
      return true;
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 10007) {
        return false;
      }
      throw error;
    }
  }

  // Only for API
  public async checkChannelByProjectId(projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        discordChannelId: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      await this.guild.channels.fetch(project.discordChannelId);
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 10003) {
        await this.loggerService.log(
          LogEventType.DISCORD_CHANNEL_NOT_FOUND,
          `Discord channel ${project.discordChannelId} was not found`,
          {
            metadata: {
              projectId,
              channelId: project.discordChannelId,
            },
          },
        );

        throw new NotFoundException({
          code: 'DISCORD_CHANNEL_NOT_FOUND',
          message: 'Discord channel not found',
        });
      }
      throw error;
    }
  }

  // Only for BE logic
  public async checkChannelByChannelId(
    projectId: string,
    channelId: string,
  ): Promise<boolean> {
    try {
      await this.guild.channels.fetch(channelId);
      return true;
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 10003) {
        await this.loggerService.log(
          LogEventType.DISCORD_CHANNEL_NOT_FOUND,
          `Discord channel ${channelId} was not found`,
          {
            metadata: {
              projectId,
              channelId: channelId,
            },
          },
        );
        return false;
      }
      throw error;
    }
  }

  public async archiveProjectChannel(
    projectId: string,
    channelId: string,
    memberRoleId: string,
  ): Promise<void> {
    try {
      const channel = await this.guild.channels.fetch(channelId);

      if (!(channel instanceof TextChannel)) {
        return;
      }

      await channel.permissionOverwrites.edit(memberRoleId, {
        ViewChannel: false,
      });
    } catch (error) {
      if (error instanceof DiscordAPIError && error.code === 10003) {
        await this.loggerService.log(
          LogEventType.DISCORD_CHANNEL_NOT_FOUND,
          `Discord channel ${channelId} was not found`,
          {
            metadata: {
              projectId,
              channelId,
            },
          },
        );

        return;
      }

      throw error;
    }
  }
}
