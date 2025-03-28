/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// File: /backend/src/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from '../schemas/user.schema';
import axios from 'axios';
import { register, tokenRequest } from '../utils/api';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private domain;
  private clientId;
  private clientSecret;
  private audience;

  constructor(
    protected readonly config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.domain = this.config.get('AUTH0_DOMAIN') as string;
    this.clientId = this.config.get('AUTH0_CLIENT_ID') as string;
    this.clientSecret = this.config.get('AUTH0_CLIENT_SECRET') as string;
    this.audience = this.config.get('AUTH0_AUDIENCE') as string;
  }
  // Helper function to get Auth0 Management API token
  private async getAuth0Token(): Promise<string> {
    const response = await axios.post(`https://${this.domain}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials',
    });
    return response.data.access_token;
  }

  // Sign Up a new user on Auth0 and save in MongoDB
  async signUp(email: string, password: string): Promise<User> {
    const token = await this.getAuth0Token();

    // Call Auth0 to create the user
    const response = await register(this.domain, email, password, token);

    const auth0User = response.data;

    // Save the user in MongoDB with Auth0 ID and email
    const newUser = new this.userModel({
      email: auth0User.email,
      auth0Id: auth0User.user_id,
    });

    return newUser.save();
  }

  public async login(username: string, password: string) {
    try {
      const requestBody = {
        username,
        password,
        grant_type: 'password',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        realm: 'Username-Password-Authentication',
        scope: 'offline_access openid',
      };
      const response = await tokenRequest(this.domain, requestBody);

      this.logger.debug(`User ${username} login successfully`);
      return {
        success: true,
        data: {
          accessToken: response.data.access_token,
        },
      };
    } catch (error) {
      this.logger.debug(`User ${username} login failed: ${error.message}`);

      if (error.response?.data) {
        this.logger.debug(
          `User ${username} needs to do MFA enrolment/challenge first`,
        );

        return {
          success: false,
          data: {
            error: error.response.data.error,
            errorDescription: error.response.data.error_description,
            mfaToken: error.response.data.mfa_token,
          },
        };
      }

      throw new HttpException(
        { success: false, data: { error: 'unknown' } },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
