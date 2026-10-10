import { IsString, MaxLength } from 'class-validator';

export class UpdateRequisitesDto {
  // Командир роти
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
  companyCommanderPatronymic!: string;

  @IsString()
  @MaxLength(100)
  companyCommanderLastName!: string;

  @IsString()
  @MaxLength(100)
  companyCommanderLastNameGenitive!: string;

  // Командир військової частини
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

  // Начальник фінансово-економічної служби
  @IsString()
  @MaxLength(200)
  financeChiefPosition!: string;

  @IsString()
  @MaxLength(100)
  financeChiefRank!: string;

  @IsString()
  @MaxLength(100)
  financeChiefFirstName!: string;

  @IsString()
  @MaxLength(100)
  financeChiefLastName!: string;
}
