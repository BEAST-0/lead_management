import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), AuthModule, UsersModule],
  controllers: [ServicesController],
  providers: [ServicesService, PermissionsGuard],
})
export class ServicesModule {}
