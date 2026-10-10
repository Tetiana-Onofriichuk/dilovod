import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrainingWithWeaponReportDto {
  @IsInt()
  soldierId!: number;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsString()
  @IsNotEmpty()
  soldierFullNameGenitive!: string;

  @IsString()
  @IsNotEmpty()
  trainingPurpose!: string;

  @IsString()
  @IsNotEmpty()
  basis!: string;

  @IsString()
  @IsNotEmpty()
  reportDate!: string;

  @IsBoolean()
  includeDryRation!: boolean;
}
