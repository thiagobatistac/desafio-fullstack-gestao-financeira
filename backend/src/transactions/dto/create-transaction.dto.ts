import {
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsEnum(['income', 'expense', 'fixed-expense'])
  type: 'income' | 'expense' | 'fixed-expense';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  recurrenceDay?: number;
}