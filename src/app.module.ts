import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CarsModule],
})
export class AppModule {}
