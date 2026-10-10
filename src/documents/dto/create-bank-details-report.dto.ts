import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBankDetailsReportDto {
  @IsInt()
  soldierId!: number;

  @IsString()
  @IsNotEmpty()
  bankAccount!: string;

  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  reportDate!: string;
}
