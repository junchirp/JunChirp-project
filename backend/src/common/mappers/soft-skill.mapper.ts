import { type UserSoftSkill } from '@prisma/client';
import { type SoftSkillResponseDto } from '../../soft-skills/dto/soft-skill.response-dto';

export class SoftSkillMapper {
  public static toResponse(skill: UserSoftSkill): SoftSkillResponseDto {
    return {
      id: skill.id,
      softSkillName: skill.softSkillName,
    };
  }
}
