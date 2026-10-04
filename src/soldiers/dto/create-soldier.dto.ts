import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSoldierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patronymic!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  rank!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  position!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  platoon!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  squad!: string;
}
