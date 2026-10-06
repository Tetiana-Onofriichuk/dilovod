import { IsString, MaxLength } from 'class-validator';

export class UpdateRequisitesDto {
  @IsString()
  @MaxLength(200)
  companyCommanderPosition!: string;

  @IsString()
  @MaxLength(100)
  companyCommanderRank!: string;

  @IsString()
  @MaxLength(100)
  companyCommanderFirstName!: string;

  @IsString()
  @MaxLength(100)
  companyCommanderLastName!: string;

  @IsString()
  @MaxLength(200)
  unitCommanderPosition!: string;

  @IsString()
  @MaxLength(100)
  unitCommanderRank!: string;

  @IsString()
  @MaxLength(100)
  unitCommanderFirstName!: string;

  @IsString()
  @MaxLength(100)
  unitCommanderLastName!: string;
}
