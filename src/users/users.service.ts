import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '.././roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  /**
   * Create and persist a user.
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
      throw new InternalServerErrorException('Failed to fetch user roles and permissions');
    }
  }
}
