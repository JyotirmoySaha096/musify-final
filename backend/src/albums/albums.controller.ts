import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any, @Query('limit') limit?: string) {
    return this.albumsService.findAll(limit ? parseInt(limit) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.albumsService.findOne(id, req.user);
  }
}
