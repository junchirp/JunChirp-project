import { type UserHardSkill } from '@prisma/client';
import { type HardSkillResponseDto } from '../../hard-skills/dto/hard-skill.response-dto';

export class HardSkillMapper {
  public static toResponse(skill: UserHardSkill): HardSkillResponseDto {
    return {
      id: skill.id,
      hardSkillName: skill.hardSkillName,
    };
  }
}
