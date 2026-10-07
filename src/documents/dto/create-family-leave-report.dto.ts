import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFamilyLeaveReportDto {
  @IsInt()
  @Min(1)
  soldierId!: number;

  @IsString()
  @IsNotEmpty()
  leaveReason!: string;

  @IsString()
  @IsNotEmpty()
  days!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  attachment!: string;

  @IsString()
  @IsNotEmpty()
  reportDate!: string;
}
