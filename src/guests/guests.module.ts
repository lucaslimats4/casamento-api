import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from './entities/guest.entity';
import { GuestGroup } from './entities/guest-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, GuestGroup])],
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}