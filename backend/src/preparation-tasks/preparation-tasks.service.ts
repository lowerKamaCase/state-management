import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreparationTaskDto } from './dto/create-preparation-task.dto';
import { UpdatePreparationTaskDto } from './dto/update-preparation-task.dto';

@Injectable()
export class PreparationTasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCarExists(carId: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      select: { id: true },
    });
    if (!car) {
      throw new NotFoundException(`Car ${carId} not found`);
    }
  }

  async findAll(carId: string) {
    await this.ensureCarExists(carId);
    return this.prisma.preparationTask.findMany({
      where: { carId },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  async create(carId: string, dto: CreatePreparationTaskDto) {
    await this.ensureCarExists(carId);
    return this.prisma.preparationTask.create({
      data: { carId, title: dto.title },
    });
  }

  async update(carId: string, taskId: string, dto: UpdatePreparationTaskDto) {
    const task = await this.prisma.preparationTask.findFirst({
      where: { id: taskId, carId },
      select: { id: true },
    });
    if (!task) {
      throw new NotFoundException(`Preparation task ${taskId} not found`);
    }
    return this.prisma.preparationTask.update({
      where: { id: taskId },
      data: { status: dto.status },
    });
  }
}
