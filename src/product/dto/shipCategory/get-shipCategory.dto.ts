import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetShipCategoryDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  page:string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  pageSize:string;
}
