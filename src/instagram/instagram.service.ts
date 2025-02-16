import { Injectable, HttpException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly baseUrl = 'https://instagram-scraper-api2.p.rapidapi.com';
  private readonly rapidApiKey = '97bfee352bmsh529350ac99792e5p171b11jsnee6aeb5b17f3'; // Hardcoded API Key
  private readonly rapidApiHost = 'instagram-scraper-api2.p.rapidapi.com'; // Hardcoded Host

  /**
   * Search for Instagram users based on a query string.
   * @param searchQuery The query string to search users.
   * @returns The search results from the API.
   */
  async searchUsers(searchQuery: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/search_users`, {
        headers: {
          'X-Rapidapi-Key': this.rapidApiKey,
          'X-Rapidapi-Host': this.rapidApiHost,
        },
        params: { search_query: searchQuery },
      });
  
      // Transform raw data into an organized format
      const users = response.data?.data?.items.map((user: any) => ({
        fullName: user.full_name || "N/A",
        username: user.username,
        profilePicture: user.profile_pic_url,
        isPrivate: user.is_private ?? false,
        isVerified: user.is_verified ?? false,
      }));
  
      return {
        status: 'success',
        totalResults: response.data?.data?.count || 0,
        users, // Return transformed users
      };
    } catch (error) {
      this.logger.error(`Error fetching users for query "${searchQuery}"`, error.stack);
  
      throw new HttpException(
        `Error fetching users: ${error.response?.data?.message || error.message}`,
        error.response?.status || 500,
      );
    }
  }
  
  async getUserInfo(usernameOrIdOrUrl: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/info`, {
        headers: {
          'X-Rapidapi-Key': this.rapidApiKey,
          'X-Rapidapi-Host': this.rapidApiHost,
        },
        params: { username_or_id_or_url: usernameOrIdOrUrl },
      });
  
      // Extract relevant data from the raw response
      const userData = response.data?.data;
  
      // Customized response with only important details
      return {
        status: 'success',
        data: {
          username: userData?.username || 'N/A',
          fullName: userData?.full_name || 'N/A',
          profilePicture: userData?.profile_pic_url || 'N/A',
          bio: userData?.biography || 'No bio available',
          followers: userData?.follower_count || 0,
          following: userData?.following_count || 0,
          isVerified: userData?.is_verified || false,
          isPrivate: userData?.is_private || false,
          externalUrl: userData?.external_url || 'N/A',
          category: userData?.category || 'N/A',
          mediaCount: userData?.media_count || 0,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error fetching user info: ${error.response?.data?.message || error.message}`,
        error.response?.status || 500,
      );
    }
  }
  
}