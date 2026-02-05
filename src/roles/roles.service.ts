import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  /**
   * Create a role and optionally attach permissions.
   */
  async create(dto: CreateRoleDto) {
    try {
      const role = this.roleRepo.create({ name: dto.name });

      if (dto.permissionIds?.length) {
        const permissions = await this.permissionRepo.find({
          where: { id: In(dto.permissionIds) },
        });

        if (permissions.length !== dto.permissionIds.length) {
          throw new NotFoundException('One or more permissions not found');
        }

        role.permissions = permissions;
      }

      return await this.roleRepo.save(role);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  /**
   * Return all roles with their permissions.
   */
  async findAll() {
    try {
      return await this.roleRepo.find({ relations: ['permissions'] });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  /**
   * Return a single role by id.
   */
  async findOne(id: number) {
    try {
      const role = await this.roleRepo.findOne({
        where: { id },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      return role;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch role');
    }
  }

  /**
   * Update a role's name or permissions.
   */
  async update(id: number, dto: UpdateRoleDto) {
    try {
      const role = await this.findOne(id);

      if (dto.name) {
        role.name = dto.name;
      }

      if (dto.permissionIds) {
        const permissions = await this.permissionRepo.find({
          where: { id: In(dto.permissionIds) },
        });

        if (permissions.length !== dto.permissionIds.length) {
          throw new NotFoundException('One or more permissions not found');
        }

        role.permissions = permissions;
      }

      return await this.roleRepo.save(role);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  /**
   * Delete a role by id.
   */
  async remove(id: number) {
    try {
      const role = await this.findOne(id);
      return await this.roleRepo.remove(role);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete role');
    }
  }
}
