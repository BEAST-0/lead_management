import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  /**
   * Create a service after ensuring the name is unique.
   */
  async create(dto: CreateServiceDto) {
    try {
      const existing = await this.serviceRepo.findOne({
        where: { name: dto.name },
      });

      if (existing) {
        throw new ConflictException('Service already exists');
      }

      const service = this.serviceRepo.create(dto);
      return await this.serviceRepo.save(service);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Failed to create service');
    }
  }

  /**
   * Return all services.
   */
  async findAll() {
    try {
      return this.serviceRepo.find();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Failed to fetch services');
    }
  }

  /**
   * Return one service by id.
   */
  async findOne(id: number) {
    try {
      const service = await this.serviceRepo.findOne({ where: { id } });
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      return service;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Failed to fetch service');
    }
  }

  /**
   * Update a service by id with the provided fields.
   */
  async update(id: number, dto: UpdateServiceDto) {
    try {
      const service = await this.findOne(id);
      Object.assign(service, dto);
      return this.serviceRepo.save(service);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Failed to update service');
    }
  }

  /**
   * Delete a service by id.
   */
  async remove(id: number) {
    try {
      const service = await this.findOne(id);
      await this.serviceRepo.remove(service);
      return { message: 'Service deleted successfully' };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Failed to delete service');
    }
  }
}
