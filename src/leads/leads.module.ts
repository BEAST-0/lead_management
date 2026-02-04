import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Service, User]), AuthModule, UsersModule],
  providers: [LeadsService, PermissionsGuard],
  controllers: [LeadsController],
})
export class LeadsModule {}
