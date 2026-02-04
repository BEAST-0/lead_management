import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { seedInitialData } from './initial-data.seed';
import { DataSource } from 'typeorm';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  await seedInitialData(dataSource);

  await app.close();

  console.log('seed completed');
}

runSeed().catch((error) => {
  console.error('seed failed', error);
  process.exit(1);
});
