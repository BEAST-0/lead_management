import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), UsersModule],
  providers: [RolesService, PermissionsGuard],
  controllers: [RolesController],
})
export class RolesModule {}
