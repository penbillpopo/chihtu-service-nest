import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import {IProdSpec} from '../../format/IProdSpec'
export class CreateProductDTO {
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
