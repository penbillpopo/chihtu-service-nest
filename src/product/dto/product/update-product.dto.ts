import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional,IsArray } from 'class-validator';
import {IProdSpec} from './IProdSpec'

export class UpdateProductDTO {
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
  firstCategory: string;

  @ApiProperty()
  @IsString()
  secondCategory: string;
  
  @ApiProperty()
  @IsString()
  detail: string;

  @ApiProperty()
  @IsNumber()
  hasSpec: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstSpec: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondSpec: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  headImage: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  prodImages: string;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsArray()
  spec: Array<IProdSpec>;
}
