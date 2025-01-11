import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Instagram')
@Controller('instagram') // Matches the 'instagram' part of the route
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @ApiQuery({ name: 'query', required: true, description: 'Search query for users' })
  @Get('search-users') // Matches the 'search-users' part of the route
  async searchUsers(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }
    return await this.instagramService.searchUsers(query);
  }

  @ApiQuery({ name: 'username', required: true, description: 'Instagram username or ID or URL' })
  @Get('user-info')
  async getUserInfo(@Query('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username parameter is required');
    }
    return await this.instagramService.getUserInfo(username);
  }

}