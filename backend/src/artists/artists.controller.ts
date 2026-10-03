import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any, @Query('limit') limit?: string) {
    return this.artistsService.findAll(
      req.user,
      limit ? parseInt(limit) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.artistsService.findOne(id, req.user);
  }
}
