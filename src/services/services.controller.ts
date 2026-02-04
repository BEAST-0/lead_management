import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
/**
 * Service endpoints protected by JWT auth and permission checks.
 */
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Permissions('CREATE_SERVICE')
  /**
   * Create a new service (requires CREATE_SERVICE).
   */
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @Permissions('VIEW_SERVICE')
  /**
   * List all services (requires VIEW_SERVICE).
   */
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @Permissions('VIEW_SERVICE')
  /**
   * Fetch a single service by id (requires VIEW_SERVICE).
   */
  findOne(@Param('id') id: number) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('UPDATE_SERVICE')
  /**
   * Update a service by id (requires UPDATE_SERVICE).
   */
  update(@Param('id') id: number, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('DELETE_SERVICE')
  /**
   * Delete a service by id (requires DELETE_SERVICE).
   */
  remove(@Param('id') id: number) {
    return this.servicesService.remove(+id);
  }
}
