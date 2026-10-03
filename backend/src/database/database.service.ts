import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';
import { initModels } from '../models';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public sequelize!: Sequelize;
  public models!: ReturnType<typeof initModels>;

  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const username = process.env.DB_USER || 'musify';
    const password = process.env.DB_PASSWORD || 'musify_secret';
    const database = process.env.DB_NAME || 'musify_clone';

    // Note: avoid `sync()`; schema should be managed by migrations.
    this.sequelize = new Sequelize(database, username, password, {
      dialect: 'postgres',
      host,
      port,
      logging: false,
      define: {
        underscored: false,
      },
      // SSL Disabled for Docker compatibility
      // ...(host !== 'localhost' && host !== '127.0.0.1' && {
      //   dialectOptions: {
      //     ssl: {
      //       require: true,
      //       rejectUnauthorized: false,
      //     },
      //   },
      // }),
    });

    this.models = initModels(this.sequelize);
  }

  async onModuleInit() {
    // Ensure the DB is reachable on app startup.
    await this.sequelize.authenticate();

    // Auto-seed default roles
    try {
      const Role = this.models.Role;
      await Role.findOrCreate({
        where: { name: 'admin' },
        defaults: { description: 'Administrator with full access' },
      });
      await Role.findOrCreate({
        where: { name: 'user' },
        defaults: { description: 'Standard user' },
      });
    } catch (e) {
      console.error(e);
      console.warn('Failed to auto-seed roles (tables might not be ready yet)');
    }
  }
}
