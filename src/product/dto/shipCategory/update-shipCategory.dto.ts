import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShipCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  @IsString()
  name: string;
}
