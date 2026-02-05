import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), UsersModule],
  providers: [PermissionsService, PermissionsGuard],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
