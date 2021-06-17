import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateProductDTO {
  @ApiProperty()
  @IsString()
  file: string;
}
