import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from '.././roles/entities/role.entity';
import { UsersController } from './users.controller';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, PermissionsGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
