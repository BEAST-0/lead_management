import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  serviceId: number;
}
