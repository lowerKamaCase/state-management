import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';
import { PreparationTasksModule } from './preparation-tasks/preparation-tasks.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CarsModule,
    PreparationTasksModule,
  ],
})
export class AppModule {}
