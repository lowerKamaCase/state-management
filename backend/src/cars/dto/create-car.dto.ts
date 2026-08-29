import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brand: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  model: string;

  @ApiProperty({ example: 2021 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ example: 24500 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 15000, required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;

  @ApiProperty({ example: 'White' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  color: string;

  @ApiProperty({ enum: BodyType, example: BodyType.SEDAN })
  @IsEnum(BodyType)
  bodyType: BodyType;
}
