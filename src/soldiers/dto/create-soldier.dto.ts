import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSoldierDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastNameGenitive?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  patronymic?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  rank?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  position?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  positionGenitive?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  platoon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  platoonGenitive?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  squad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  weapon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
