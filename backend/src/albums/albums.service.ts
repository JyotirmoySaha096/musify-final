import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumsService {
  constructor(private db: DatabaseService) {}
  getAllowedVisibilities(user: any): string[] {
    const roles = user?.roles || [];
    if (roles.includes('admin') || roles.includes('exclusive')) {
      return ['public', 'member', 'exclusive'];
    }
    if (roles.includes('member')) {
      return ['public', 'member'];
    }
    return ['public'];
  }


  async findAll(limit?: number) {
    const { Album, Artist } = this.db.models as any;
    return Album.findAll({
      include: [{ model: Artist, as: 'artist' }],
      order: [['title', 'ASC']],
      limit: limit ?? undefined,
    });
  }

  async findOne(id: string, user?: any) {
    const { Album, Artist, Song } = this.db.models as any;

    const album = await Album.findOne({
      where: { id },
      include: [
        { model: Artist, as: 'artist' },
        {
          model: Song,
          where: { visibility: this.getAllowedVisibilities(user) },
          required: false,
          as: 'songs',
          include: [{ model: Artist, as: 'artist' }],
        },
      ],
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    // Sort songs by track number
    if (album.songs) {
      album.songs.sort(
        (a: any, b: any) => (a.trackNumber || 0) - (b.trackNumber || 0),
      );
    }
    return album;
  }
}
