import { ApiProperty } from '@nestjs/swagger';
import { CarResponseDto } from './car-response.dto';

export class PreparationProgressDto {
  @ApiProperty({ example: 2 })
  done!: number;

  @ApiProperty({ example: 3 })
  total!: number;
}

export class CarListItemResponseDto extends CarResponseDto {
  @ApiProperty({ type: PreparationProgressDto })
  preparation!: PreparationProgressDto;
}

export class CarsPageMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;

  @ApiProperty({ example: 60 })
  total!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;
}

export class CarsListResponseDto {
  @ApiProperty({ type: [CarListItemResponseDto] })
  data!: CarListItemResponseDto[];

  @ApiProperty({ type: CarsPageMetaDto })
  meta!: CarsPageMetaDto;
}
