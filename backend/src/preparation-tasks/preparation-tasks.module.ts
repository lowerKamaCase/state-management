import { Module } from '@nestjs/common';
import { PreparationTasksController } from './preparation-tasks.controller';
import { PreparationTasksService } from './preparation-tasks.service';

@Module({
  controllers: [PreparationTasksController],
  providers: [PreparationTasksService],
})
export class PreparationTasksModule {}
