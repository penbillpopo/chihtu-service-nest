import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetProductDetailDTO {
  @ApiProperty()
  @IsString()
  id:string
}
