import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';

import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('leads')
/**
 * Lead endpoints protected by JWT auth and permission checks.
 */
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Permissions('CREATE_LEAD')
  /**
   * Create a new lead (requires CREATE_LEAD).
   */
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  @Permissions('VIEW_LEAD')
  /**
   * List all leads with related service and assignment data (requires VIEW_LEAD).
   */
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @Permissions('VIEW_LEAD')
  /**
   * Fetch a single lead by id (requires VIEW_LEAD).
   */
  findOne(@Param('id') id: number) {
    return this.leadsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('UPDATE_LEAD')
  /**
   * Update lead fields by id (requires UPDATE_LEAD).
   */
  update(@Param('id') id: number, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('DELETE_LEAD')
  /**
   * Delete a lead by id (requires DELETE_LEAD).
   */
  remove(@Param('id') id: number) {
    return this.leadsService.remove(+id);
  }

  @Put(':id/assign/:userId')
  @Permissions('ASSIGN_LEAD')
  /**
   * Assign a lead to a user (requires ASSIGN_LEAD).
   */
  assignLead(@Param('id') id: number, @Param('userId') userId: number) {
    return this.leadsService.assignLead(+id, +userId);
  }
}
