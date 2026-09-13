import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  Client,
  Guild,
  ChannelType,
  PermissionResolvable,
  TextChannel,
  DiscordAPIError,
} from 'discord.js';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Once } from 'necord';
import { PrismaService } from '../prisma/prisma.service';
import { isPrismaError } from '../common/utils/is-prisma-error';

@Injectable()
export class DiscordService {
  private readonly guildId: string;

  private readonly botToken: string;

  private guild!: Guild;

  public constructor(
    private readonly configService: ConfigService,
    private readonly client: Client,
    private readonly prisma: PrismaService,
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

  public async createProjectChannel(
    projectName: string,
  ): Promise<{ channelId: string; adminRoleId: string; memberRoleId: string }> {
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

    const [adminRole, memberRole] = await Promise.all([
      this.guild.roles.create({
        name: `${projectName}_admin`,
        permissions: adminPermissions,
      }),
      this.guild.roles.create({
        name: `${projectName}_member`,
        permissions: memberPermissions,
      }),
    ]);

    const botRole = this.guild.roles.cache.find(
      (role) => role.name === 'JunChirp',
    );
    if (!botRole) {
      throw new Error('Bot role "JunChirp" not found');
    }

    const channel = await this.guild.channels.create({
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

    return {
      channelId: channel.id,
      adminRoleId: adminRole.id,
      memberRoleId: memberRole.id,
    };
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
    if (!this.guild.client.readyAt) {
      await new Promise((resolve) => {
        this.guild.client.once('ready', resolve);
      });
    }

    const retryAsync = async <T>(
      fn: () => Promise<T>,
      retries = 3,
      delayMs = 1000,
    ): Promise<T | null> => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const result = await fn();
          if (result) {
            return result;
          }
        } catch {
          // ignore error
        }
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
      return null;
    };

    const channel = await retryAsync(() =>
      this.guild.channels.fetch(discordChannelId),
    );
    if (!channel) {
      throw new Error('Channel not found');
    }
    await channel.delete();

    const adminRole = await retryAsync(() =>
      this.guild.roles.fetch(discordAdminRoleId),
    );
    if (adminRole) {
      await adminRole.delete();
    }

    const memberRole = await retryAsync(() =>
      this.guild.roles.fetch(discordMemberRoleId),
    );
    if (memberRole) {
      await memberRole.delete();
    }
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
}
