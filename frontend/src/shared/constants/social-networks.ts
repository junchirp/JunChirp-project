import { ClientSocialInterface } from '@/shared/interfaces/social.interface';

export const socialNetworks: ClientSocialInterface[] = [
  {
    network: 'Facebook',
    icon: '/images/facebook.svg',
    urlRegex:
      /^(https?:\/\/)?(www\.)?facebook\.com\/((profile\.php\?id=\d+)|[A-Za-z0-9._-]+)\/?$/i,
  },
  {
    network: 'X Twitter',
    icon: '/images/x-twitter.svg',
    urlRegex:
      /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]{1,15}\/?$/i,
  },
  {
    network: 'Instagram',
    icon: '/images/instagram.svg',
    urlRegex: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/i,
  },
  {
    network: 'LinkedIn',
    icon: '/images/linkedin.svg',
    urlRegex:
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/i,
  },
  {
    network: 'Discord',
    icon: 'images/discord.svg',
    urlRegex:
      /^(https?:\/\/)?(www\.)?discord(\.gg|app\.com\/users)\/[A-Za-z0-9]+\/?$/i,
  },
  {
    network: 'Telegram',
    icon: 'images/telegram.svg',
    urlRegex: /^(https?:\/\/)?(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/i,
  },
  {
    network: 'GitHub',
    icon: 'images/github.svg',
    urlRegex: /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/i,
  },
  {
    network: 'GitLab',
    icon: 'images/gitlab.svg',
    urlRegex: /^(https?:\/\/)?(www\.)?gitlab\.com\/[A-Za-z0-9_.-]+\/?$/i,
  },
  {
    network: 'YouTube',
    icon: 'images/youtube.svg',
    urlRegex:
      /^(https?:\/\/)?(www\.)?youtube\.com\/(c|channel|user)\/[A-Za-z0-9_-]+\/?$/i,
  },
];
