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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';
import * as mm from 'music-metadata';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private db: DatabaseService) {}

  private async checkStorageQuota(newFile?: any) {
    if (!newFile) return;
    const mediaDir = './media';
    let totalSize = 0;
    try {
      if (fs.existsSync(mediaDir)) {
        const files = await fs.promises.readdir(mediaDir);
        for (const f of files) {
          const stats = await fs.promises.stat(path.join(mediaDir, f));
          totalSize += stats.size;
        }
      }
    } catch (err) {
      console.error('Failed to calculate directory size', err);
    }

    const maxGb = parseFloat(process.env.MAX_MEDIA_STORAGE_GB || '5');
    const maxBytes = maxGb * 1024 * 1024 * 1024;

    if (totalSize > maxBytes) {
      // Rollback: delete the newly uploaded file
      try {
        if (newFile && newFile.filename) {
          fs.unlinkSync(path.join(mediaDir, newFile.filename));
        }
      } catch (e) {
        console.error('Failed to delete', e);
      }
      throw new BadRequestException(
        `Storage quota exceeded (${maxGb}GB limit). Cannot upload more files.`,
      );
    }
  }

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
        'isActive',
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

  
  @Put('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    const user = await this.db.models.User.findByPk(id);
    if (!user) throw new NotFoundException('User not found');

    await user.update({ isActive });
    return { success: true, message: isActive ? 'User enabled' : 'User disabled' };
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
  @Roles('admin', 'exclusive')
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
    @Req() req?: any,
  ) {
    const isAdmin = req?.user?.roles?.includes('admin');
    const visibility = body.visibility || 'member';
    if (!isAdmin && visibility === 'public') {
      throw new BadRequestException(
        'Exclusive members cannot create public songs',
      );
    }
    await this.checkStorageQuota(file);
    if (!body.title || !body.artistName) {
      throw new BadRequestException('Title and artistName are required');
    }

    let audioUrl = body.audioUrl;
    let durationSeconds = parseInt(body.durationSeconds) || 0;

    if (file) {
      audioUrl = file.filename;
      try {
        const metadata = await mm.parseFile('./media/' + file.filename);
        durationSeconds = Math.round(metadata.format.duration || 0);
      } catch (err) {
        console.error('Failed to parse metadata', err);
      }
    }

    if (!audioUrl) {
      throw new BadRequestException(
        'Either audioUrl or an uploaded file is required',
      );
    }

    // Find or create artist
    const [artist] = await this.db.models.Artist.findOrCreate({
      where: { name: body.artistName },
      defaults: {
        id: uuidv4(),
        name: body.artistName,
        bio: '',
        imageUrl: '',
      },
    });

    const albumName = body.albumName || 'Single';
    // Find or create album
    const [album] = await this.db.models.Album.findOrCreate({
      where: { title: albumName, artistId: artist.getDataValue('id') },
      defaults: {
        id: uuidv4(),
        title: albumName,
        artistId: artist.getDataValue('id'),
        releaseYear: new Date().getFullYear(),
        imageUrl: '',
      },
    });

    const song = await this.db.models.Song.create({
      id: uuidv4(),
      title: body.title,
      artistId: artist.getDataValue('id'),
      albumId: album.getDataValue('id'),
      trackNumber: body.trackNumber || 1,
      durationSeconds,
      audioUrl: audioUrl,
      visibility,
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
    await this.checkStorageQuota(file);
    const song = await this.db.models.Song.findByPk(id);
    if (!song) throw new NotFoundException('Song not found');

    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.visibility) updateData.visibility = body.visibility;

    if (body.artistName) {
      const [artist] = await this.db.models.Artist.findOrCreate({
        where: { name: body.artistName },
        defaults: {
          id: uuidv4(),
          name: body.artistName,
          bio: '',
          imageUrl: '',
        },
      });
      updateData.artistId = artist.getDataValue('id');

      const albumName = body.albumName || 'Single';
      const [album] = await this.db.models.Album.findOrCreate({
        where: { title: albumName, artistId: artist.getDataValue('id') },
        defaults: {
          id: uuidv4(),
          title: albumName,
          artistId: artist.getDataValue('id'),
          releaseYear: new Date().getFullYear(),
          imageUrl: '',
        },
      });
      updateData.albumId = album.getDataValue('id');
    }

    if (file) {
      updateData.audioUrl = file.filename;
      try {
        const metadata = await mm.parseFile('./media/' + file.filename);
        updateData.durationSeconds = Math.round(metadata.format.duration || 0);
      } catch (err) {
        console.error('Failed to parse metadata', err);
      }
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
