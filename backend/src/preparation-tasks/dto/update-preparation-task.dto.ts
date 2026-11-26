import { ApiProperty } from '@nestjs/swagger';
import { PreparationTaskStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdatePreparationTaskDto {
  @ApiProperty({
    enum: PreparationTaskStatus,
    example: PreparationTaskStatus.DONE,
  })
  @IsEnum(PreparationTaskStatus)
  status!: PreparationTaskStatus;
}
