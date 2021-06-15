import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
