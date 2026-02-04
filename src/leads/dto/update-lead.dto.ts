import { IsOptional, IsString } from 'class-validator';

export class UpdateLeadDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
