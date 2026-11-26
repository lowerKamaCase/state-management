import { ApiProperty } from '@nestjs/swagger';
import { PreparationTaskStatus } from '@prisma/client';

export class PreparationTaskResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  carId!: string;

  @ApiProperty({ example: 'Take photos' })
  title!: string;

  @ApiProperty({ enum: PreparationTaskStatus })
  status!: PreparationTaskStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
