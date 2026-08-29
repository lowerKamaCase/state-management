import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { QueryCarsDto } from './dto/query-cars.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryCarsDto) {
    const {
      page,
      pageSize,
      sortBy,
      order,
      brand,
      bodyType,
      color,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      search,
    } = query;

    const where: Prisma.CarWhereInput = {
      ...(brand && { brand: { equals: brand, mode: 'insensitive' } }),
      ...(bodyType && { bodyType }),
      ...(color && { color: { equals: color, mode: 'insensitive' } }),
      ...((minYear !== undefined || maxYear !== undefined) && {
        year: {
          ...(minYear !== undefined && { gte: minYear }),
          ...(maxYear !== undefined && { lte: maxYear }),
        },
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
      ...(search && {
        OR: [
          { brand: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.car.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException(`Car ${id} not found`);
    return car;
  }

  create(dto: CreateCarDto) {
    return this.prisma.car.create({ data: dto });
  }

  async update(id: string, dto: UpdateCarDto) {
    await this.findOne(id);
    return this.prisma.car.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.car.delete({ where: { id } });
  }
}
