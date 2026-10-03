import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  Res,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.songsService.findAll(limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  /**
   * Issue a short-lived stream token for a specific song.
   * Requires a valid user JWT so anonymous callers cannot generate tokens.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/stream-token')
  getStreamToken(@Param('id') id: string, @Request() req: any) {
    // req.user is populated by JwtAuthGuard from the bearer token
    void req.user; // ensure guard ran
    const clientIp =
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip;
    return this.songsService.generateStreamToken(id, clientIp);
  }

  /**
   * Stream the audio for a song.
   * Authentication is performed via a short-lived `token` query param
   * (signed by the server, expires in 30m, tied to songId + requester IP).
   * Copying the URL to another device/network will fail.
   */
  @Get(':id/stream')
  async streamAudio(
    @Param('id') id: string,
    @Query('token') token: string,
    @Headers('range') range: string | undefined,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const clientIp =
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip;
    return this.songsService.streamAudio(id, token, range, clientIp, res);
  }
}
