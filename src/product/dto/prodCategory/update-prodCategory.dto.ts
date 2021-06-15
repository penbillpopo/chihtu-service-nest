import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProdCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  secondCategory: string;
}
