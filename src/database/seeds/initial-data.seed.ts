import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

export async function seedInitialData(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);

  // Permission list
  const permissions = [
    'CREATE_SERVICE',
    'UPDATE_SERVICE',
    'DELETE_SERVICE',
    'VIEW_SERVICE',
    'CREATE_LEAD',
    'UPDATE_LEAD',
    'DELETE_LEAD',
    'VIEW_LEAD',
    'ASSIGN_LEAD',
  ];

  // Insert permission if not exist
  const permissionEntities: Permission[] = [];

  for (const name of permissions) {
    let permission = await permissionRepo.findOne({ where: { name } });

    if (!permission) {
      permission = permissionRepo.create({ name });
      permission = await permissionRepo.save(permission);
    }

    permissionEntities.push(permission);
  }

  // Define roles
  const roles = ['ADMIN', 'SALES', 'VIEWER'];

  // create role if not exist
  const roleEntites: Record<string, Role> = {};

  for (const roleName of roles) {
    let role = await roleRepo.findOne({ where: { name: roleName }, relations: ['permissions'] });

    if (!role) {
      role = roleRepo.create({ name: roleName, permissions: [] });
      role = await roleRepo.save(role);
    }

    roleEntites[roleName] = role;
  }

  // map roles to permissions

  // ADMIN
  roleEntites.ADMIN.permissions = permissionEntities;

  //SALES
  roleEntites.SALES.permissions = permissionEntities.filter((p) =>
    ['CREATE_LEAD', 'UPDATE_LEAD', 'ASSIGN_LEAD', 'VIEW_LEAD'].includes(p.name),
  );

  //VIEWER
  roleEntites.VIEWER.permissions = permissionEntities.filter((p) =>
    ['VIEW_LEAD', 'VIEW_SERVICE'].includes(p.name),
  );

  // save role permission mapping
  await roleRepo.save(Object.values(roleEntites));

  // USER CREATION

  const USERS = [
    {
      email: 'admin@test.com',
      password: 'Admin@123',
      role: 'ADMIN',
    },
    {
      email: 'sales@test.com',
      password: 'Sales@123',
      role: 'SALES',
    },
    {
      email: 'viewer@test.com',
      password: 'Viewer@123',
      role: 'VIEWER',
    },
  ];

  for (const userData of USERS) {
    const existing = await userRepo.findOne({ where: { email: userData.email } });

    if (existing) continue;

    const hashPassword = await bcrypt.hash(userData.password, 10);

    const user = userRepo.create({
      email: userData.email,
      password: hashPassword,
      roles: [roleEntites[userData.role]],
    });

    await userRepo.save(user);
  }

  console.log('Database seeded successfully');
}
