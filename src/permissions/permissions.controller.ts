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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
/**
 * Permission management endpoints (JWT required).
 */
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  /**
   * Create a permission entry.
   */
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  /**
   * List all permissions.
   */
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  /**
   * Fetch a single permission by id.
   */
  findOne(@Param('id') id: number) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  /**
   * Update a permission by id.
   */
  update(@Param('id') id: number, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, dto);
  }

  @Delete(':id')
  /**
   * Delete a permission by id.
   */
  remove(@Param('id') id: number) {
    return this.permissionsService.remove(+id);
  }
}
