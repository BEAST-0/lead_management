import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
/**
 * Role management endpoints (JWT required).
 */
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  /**
   * Create a role.
   */
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  /**
   * List all roles with their permissions.
   */
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  /**
   * Fetch a single role by id.
   */
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  /**
   * Update role name and/or permissions.
   */
  update(@Param('id') id: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(+id, dto);
  }

  @Delete(':id')
  /**
   * Delete a role by id.
   */
  remove(@Param('id') id: number) {
    return this.rolesService.remove(+id);
  }
}
