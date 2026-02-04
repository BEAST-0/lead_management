import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lead } from './entities/lead.entity';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';

import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a lead after validating the referenced service.
   */
  async create(dto: CreateLeadDto) {
    try {
      // Validate the related service before creating the lead.
      const service = await this.serviceRepository.findOne({
        where: { id: dto.serviceId },
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      const lead = this.leadRepository.create({
        customerName: dto.customerName,
        email: dto.email,
        phone: dto.phone,
        service,
      });

      return this.leadRepository.save(lead);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create lead');
    }
  }

  /**
   * Return all leads with related service and assignment data.
   */
  async findAll() {
    try {
      // Load related service and assignment to avoid N+1 queries later.
      const leads = await this.leadRepository.find({
        relations: ['service', 'assignedTo'],
      });
      for (const lead of leads) {
        delete (lead as any).assignedTo?.password;
      }
      return leads;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch leads');
    }
  }

  /**
   * Return one lead by id with related service and assignment data.
   */
  async findOne(id: number) {
    try {
      // Load related service and assignment for a complete lead view.
      const lead = await this.leadRepository.findOne({
        where: { id },
        relations: ['service', 'assignedTo'],
      });

      if (!lead) {
        throw new NotFoundException('Lead not found');
      }

      delete (lead as any).assignedTo?.password;
      return lead;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch lead');
    }
  }

  /**
   * Update a lead by id using the provided fields.
   */
  async update(id: number, dto: UpdateLeadDto) {
    try {
      // Reuse findOne for consistent not-found handling.
      const lead = await this.findOne(id);
      Object.assign(lead, dto);
      return this.leadRepository.save(lead);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update lead');
    }
  }

  /**
   * Delete a lead by id.
   */
  async remove(id: number) {
    try {
      // Ensure the lead exists before deletion.
      const lead = await this.findOne(id);
      return this.leadRepository.remove(lead);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete lead');
    }
  }

  /**
   * Assign a lead to a user by their ids.
   */
  async assignLead(leadId: number, userId: number) {
    try {
      // Ensure the lead exists before assignment.
      const lead = await this.findOne(leadId);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Persist the assignment relationship.
      lead.assignedTo = user;
      const saved = await this.leadRepository.save(lead);
      delete (saved as any).assignedTo?.password;
      return saved;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to assign lead');
    }
  }
}
