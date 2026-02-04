import { IsNumber } from 'class-validator';

export class AssignLeadDto {
  @IsNumber()
  userId: number;
}
