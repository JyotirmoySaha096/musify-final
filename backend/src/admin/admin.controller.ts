import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DatabaseService } from '../database/database.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private db: DatabaseService) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.db.models.User.findAll({
      attributes: ['id', 'email', 'username', 'googleId', 'microsoftId', 'appleId', 'facebookId', 'createdAt'],
      include: [{
        model: this.db.models.Role,
        as: 'roles',
        attributes: ['name'],
        through: { attributes: [] }
      }]
    });
    
    // Map the output to match the frontend expectations (roles string array)
    return users.map(u => {
      const user = u.get({ plain: true });
      return {
        ...user,
        roles: user.roles?.map((r: any) => r.name) || ['user']
      };
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.db.models.User.destroy({ where: { id } });
    return { success: true, message: 'User deleted' };
  }
}
