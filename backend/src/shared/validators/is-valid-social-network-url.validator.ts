import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

interface SocialNetworkInterface {
  facebook: RegExp;
  'x twitter': RegExp;
  instagram: RegExp;
  linkedin: RegExp;
  youtube: RegExp;
  // tiktok: RegExp;
  // pinterest: RegExp;
  // reddit: RegExp;
  discord: RegExp;
  telegram: RegExp;
  github: RegExp;
  gitlab: RegExp;
}

const socialNetworks: SocialNetworkInterface = {
  facebook:
    /^(https?:\/\/)?(www\.)?facebook\.com\/((profile\.php\?id=\d+)|[A-Za-z0-9._-]+)\/?$/i,
  'x twitter':
    /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]{1,15}\/?$/i,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/i,
  linkedin:
    /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/i,
  youtube:
    /^https:\/\/(www\.)?youtube\.com\/(@[\w.-]+|c\/[\w-]+|channel\/UC[a-zA-Z0-9_-]{21,})\/?$/i,
  // tiktok: /^https:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_]+$/,
  // pinterest: /^https:\/\/(www\.)?pinterest\.com\/[a-zA-Z0-9_]+$/,
  // reddit: /^https:\/\/(www\.)?reddit\.com\/u\/[a-zA-Z0-9_]+$/,
  discord:
    /^(https?:\/\/)?(www\.)?discord(\.gg|app\.com\/users)\/[A-Za-z0-9]+\/?$/i,
  telegram: /^(https?:\/\/)?(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/i,
  github: /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/i,
  gitlab: /^(https?:\/\/)?(www\.)?gitlab\.com\/[A-Za-z0-9_.-]+\/?$/i,
};

@ValidatorConstraint({ name: 'isValidSocialNetworkUrl', async: false })
export class IsValidSocialNetworkUrlValidator
  implements ValidatorConstraintInterface
{
  public validate(url: string, args: ValidationArguments): boolean {
    const { network } = args.object as {
      network: keyof SocialNetworkInterface;
    };

    if (!(network in socialNetworks)) {
      return true;
    }

    return socialNetworks[network].test(url);
  }

  public defaultMessage(): string {
    return 'Invalid social network URL';
  }
}

export function IsValidSocialNetworkUrl(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidSocialNetworkUrlValidator,
    });
  };
}
