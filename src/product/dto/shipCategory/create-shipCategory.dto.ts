import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateShipCategoryDTO {
  @ApiProperty()
  @IsString()
  name: string;
}