import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GuestsModule } from './guests/guests.module';
import { GiftsModule } from './gifts/gifts.module';
import { Guest } from './guests/entities/guest.entity';
import { GuestGroup } from './guests/entities/guest-group.entity';
import { Gift } from './gifts/entities/gift.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Guest, GuestGroup, Gift],
        synchronize: true, // Apenas para desenvolvimento
        ssl: configService.get<string>('DB_SSL') === 'true' ? {
          rejectUnauthorized: false,
        } : false,
      }),
      inject: [ConfigService],
    }),
    GuestsModule,
    GiftsModule,
  ],
})
export class AppModule {}