import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistsService {
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
    const { Artist } = this.db.models as any;
    return Artist.findAll({
      order: [['name', 'ASC']],
      limit: limit ?? undefined,
    });
  }

  async findOne(id: string, user?: any) {
    const { Artist, Album, Song } = this.db.models as any;

    const artist = await Artist.findOne({
      where: { id },
      include: [
        {
          model: Album,
          as: 'albums',
          include: [{ model: Song, as: 'songs', where: { visibility: this.getAllowedVisibilities(user) }, required: false }],
        },
        { model: Song, as: 'songs', where: { visibility: this.getAllowedVisibilities(user) }, required: false },
      ],
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }
}
