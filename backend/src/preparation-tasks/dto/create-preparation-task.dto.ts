import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePreparationTaskDto {
  @ApiProperty({ example: 'Take photos' })
  @Transform(({ value }: { value: unknown }) => {
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;
}
