import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CarResponseDto } from './dto/car-response.dto';
import { CarsListResponseDto } from './dto/cars-list-response.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { QueryCarsDto } from './dto/query-cars.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOkResponse({ type: CarsListResponseDto })
  findAll(@Query() query: QueryCarsDto) {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CarResponseDto })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: CarResponseDto })
  create(@Body() dto: CreateCarDto) {
    return this.carsService.create(dto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CarResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
