import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateVacationReportDto {
  @IsInt()
  @Min(1)
  soldierId!: number;

  @IsString()
  @IsNotEmpty()
  days!: string;

  @IsString()
  @IsNotEmpty()
  travelDays!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  address!: string;

  @IsString()
  @IsNotEmpty()
  transport!: string;

  @IsString()
  @IsNotEmpty()
  reportDate!: string;
}
