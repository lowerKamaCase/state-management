import { ApiProperty } from '@nestjs/swagger';
import { BodyType } from '@prisma/client';

export class CarResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  brand!: string;

  @ApiProperty()
  model!: string;

  @ApiProperty()
  year!: number;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  mileage!: number;

  @ApiProperty()
  color!: string;

  @ApiProperty({ enum: BodyType })
  bodyType!: BodyType;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
