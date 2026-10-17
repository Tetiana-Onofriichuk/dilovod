import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePositionAcceptanceReportDto {
  @IsInt()
  @Min(1)
  soldierId!: number;

  @IsString()
  @IsNotEmpty()
  reportDate!: string;
}
