import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetProductDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  page:string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  pageSize:string;
}
