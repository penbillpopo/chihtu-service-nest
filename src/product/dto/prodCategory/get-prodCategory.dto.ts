import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetProdCategoryDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  page:string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  pageSize:string;
}
