import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class AdditionalSoldierGenitiveDto {
  @IsInt()
  soldierId!: number;

  @IsString()
  @IsNotEmpty()
  fullNameGenitive!: string;
}

export class CreateTrainingWithoutWeaponReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  soldierIds!: number[];

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalSoldierGenitiveDto)
  additionalSoldiersGenitive!: AdditionalSoldierGenitiveDto[];

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
