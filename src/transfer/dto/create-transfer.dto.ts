import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty({ message: 'Account origin (from) is required' })
  @IsString()
  from: string;

  @IsNotEmpty({ message: 'Account destination (to) is required' })
  @IsString()
  to: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than zero' })
  amount: number;
}