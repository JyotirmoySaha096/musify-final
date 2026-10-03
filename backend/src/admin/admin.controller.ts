import {
  Controller,
  Get,
  Delete,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private db: DatabaseService) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.db.models.User.findAll({
      attributes: [
        'id',
        'email',
        'username',
        'googleId',
        'microsoftId',
        'appleId',
        'facebookId',
        'createdAt',
      ],
      include: [
        {
          model: this.db.models.Role,
          as: 'roles',
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
    });

    // Map the output to match the frontend expectations (roles string array)
    return users.map((u) => {
      const user = u.get({ plain: true });
      return {
        ...user,
        roles: user.roles?.map((r: any) => r.name) || ['user'],
      };
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.db.models.User.destroy({ where: { id } });
    return { success: true, message: 'User deleted' };
  }

  @Put('users/:id/roles')
  async updateUserRoles(
    @Param('id') id: string,
    @Body('roles') roleNames: string[],
  ) {
    const user = await this.db.models.User.findByPk(id);
    if (!user) throw new NotFoundException('User not found');

    // Find role records
    const roles = await this.db.models.Role.findAll({
      where: { name: roleNames },
    });

    // Set roles via junction table
    await (user as any).setRoles(roles);

    return { success: true, message: 'Roles updated' };
  }

  @Get('roles')
  async getRoles() {
    return this.db.models.Role.findAll();
  }

  @Post('songs')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './media',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  async createSong(
    @Body() body: any,
    @UploadedFile() file?: any,
  ) {
    if (!body.title || !body.artistId) {
      throw new BadRequestException('Title and artistId are required');
    }

    let audioUrl = body.audioUrl;
    if (file) {
      audioUrl = file.filename;
    }

    if (!audioUrl) {
      throw new BadRequestException(
        'Either audioUrl or an uploaded file is required',
      );
    }

    const song = await this.db.models.Song.create({
      id: uuidv4(),
      title: body.title,
      artistId: body.artistId,
      albumId: body.albumId || null,
      trackNumber: body.trackNumber || null,
      durationSeconds: body.durationSeconds || 0,
      audioUrl: audioUrl,
    });
    return song;
  }

  @Put('songs/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './media',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  async updateSong(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: any,
  ) {
    const song = await this.db.models.Song.findByPk(id);
    if (!song) throw new NotFoundException('Song not found');

    const updateData: any = {
      title: body.title,
      artistId: body.artistId,
      albumId: body.albumId || null,
      trackNumber: body.trackNumber || null,
      durationSeconds: body.durationSeconds || (song as any).durationSeconds,
    };

    if (file) {
      updateData.audioUrl = file.filename;
    } else if (body.audioUrl) {
      updateData.audioUrl = body.audioUrl;
    }

    await song.update(updateData);
    return song;
  }

  @Delete('songs/:id')
  async deleteSong(@Param('id') id: string) {
    const song = await this.db.models.Song.findByPk(id);
    if (!song) throw new NotFoundException('Song not found');

    await song.destroy();
    return { success: true, message: 'Song deleted' };
  }
}
