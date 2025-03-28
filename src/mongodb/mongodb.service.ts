/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongodbService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const uri: string = this.configService.get('MONGO_URI') as string;
    if (!uri) {
      throw new Error('MongoDB URI is not defined');
    }

    return {
      uri,
      connectionFactory: (connection: any) => {
        return connection;
      },
    };
  }
}
