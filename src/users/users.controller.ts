import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
/**
 * User management endpoints (JWT required).
 */
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  /**
   * Create a user with optional roles.
   */
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  /**
   * List all users with roles and permissions.
   */
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  /**
   * Fetch a single user by id.
   */
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  /**
   * Update user email, password, or roles.
   */
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(+id, dto);
  }

  @Delete(':id')
  /**
   * Delete a user by id.
   */
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
