import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Role } from '.././roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  /**
   * Create and persist a user (expects a pre-hashed password).
   */
  create(data: Partial<User>) {
    try {
      return this.userRepo.save(data);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Create a user with a hashed password and optional roles.
   */
  async createUser(dto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.userRepo.create({
        email: dto.email,
        password: hashedPassword,
      });

      if (dto.roleIds?.length) {
        const roles = await this.roleRepo.find({
          where: { id: In(dto.roleIds) },
        });
        if (roles.length !== dto.roleIds.length) {
          throw new NotFoundException('One or more roles not found');
        }
        user.roles = roles;
      }

      const saved = await this.userRepo.save(user);
      delete (saved as any).password;
      return saved;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Look up a user by email.
   */
  findByMail(email: string) {
    try {
      return this.userRepo.findOne({ where: { email } });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch user by email');
    }
  }

  /**
   * Return all users with roles and permissions (password removed).
   */
  async findAll() {
    try {
      const users = await this.userRepo.find({
        relations: ['roles', 'roles.permissions'],
      });
      for (const user of users) {
        delete (user as any).password;
      }
      return users;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  /**
   * Return a user by id (password removed).
   */
  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
        relations: ['roles', 'roles.permissions'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      delete (user as any).password;
      return user;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  /**
   * Update a user and optionally reset roles or password.
   */
  async updateUser(id: number, dto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (dto.email) {
        user.email = dto.email;
      }

      if (dto.password) {
        user.password = await bcrypt.hash(dto.password, 10);
      }

      if (dto.roleIds) {
        const roles = await this.roleRepo.find({
          where: { id: In(dto.roleIds) },
        });
        if (roles.length !== dto.roleIds.length) {
          throw new NotFoundException('One or more roles not found');
        }
        user.roles = roles;
      }

      const saved = await this.userRepo.save(user);
      delete (saved as any).password;
      return saved;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Delete a user by id.
   */
  async remove(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const removed = await this.userRepo.remove(user);
      delete (removed as any).password;
      return removed;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Return a user with roles and permissions for auth checks.
   */
  async findByIdWithRolesAndPermissions(userId: number) {
    try {
      return this.userRepo.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions'],
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to fetch user roles and permissions',
      );
    }
  }
}
