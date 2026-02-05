import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  /**
   * Create a permission entry.
   */
  async create(dto: CreatePermissionDto) {
    try {
      const permission = this.permissionRepo.create(dto);
      return await this.permissionRepo.save(permission);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create permission');
    }
  }

  /**
   * Return all permissions.
   */
  async findAll() {
    try {
      return await this.permissionRepo.find();
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch permissions');
    }
  }

  /**
   * Return one permission by id.
   */
  async findOne(id: number) {
    try {
      const permission = await this.permissionRepo.findOne({ where: { id } });
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }
      return permission;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch permission');
    }
  }

  /**
   * Update a permission by id.
   */
  async update(id: number, dto: UpdatePermissionDto) {
    try {
      const permission = await this.findOne(id);
      Object.assign(permission, dto);
      return await this.permissionRepo.save(permission);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update permission');
    }
  }

  /**
   * Delete a permission by id.
   */
  async remove(id: number) {
    try {
      const permission = await this.findOne(id);
      return await this.permissionRepo.remove(permission);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete permission');
    }
  }
}
