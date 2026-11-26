import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePreparationTaskDto } from './dto/create-preparation-task.dto';
import { PreparationTaskResponseDto } from './dto/preparation-task-response.dto';
import { UpdatePreparationTaskDto } from './dto/update-preparation-task.dto';
import { PreparationTasksService } from './preparation-tasks.service';

@ApiTags('preparation-tasks')
@ApiParam({ name: 'carId', format: 'uuid' })
@Controller('cars/:carId/preparation-tasks')
export class PreparationTasksController {
  constructor(
    private readonly preparationTasksService: PreparationTasksService,
  ) {}

  @Get()
  @ApiOkResponse({ type: PreparationTaskResponseDto, isArray: true })
  findAll(@Param('carId') carId: string) {
    return this.preparationTasksService.findAll(carId);
  }

  @Post()
  @ApiCreatedResponse({ type: PreparationTaskResponseDto })
  create(@Param('carId') carId: string, @Body() dto: CreatePreparationTaskDto) {
    return this.preparationTasksService.create(carId, dto);
  }

  @Patch(':taskId')
  @ApiParam({ name: 'taskId', format: 'uuid' })
  @ApiOkResponse({ type: PreparationTaskResponseDto })
  update(
    @Param('carId') carId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdatePreparationTaskDto,
  ) {
    return this.preparationTasksService.update(carId, taskId, dto);
  }
}
