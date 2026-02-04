import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, IsNull, ILike } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { GuestGroup } from './entities/guest-group.entity';
import { SearchGuestsResponseDto, GuestGroupResponseDto, GuestResponseDto } from './dto/guest-response.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    @InjectRepository(GuestGroup)
    private guestGroupRepository: Repository<GuestGroup>,
  ) {}

  async searchGuests(name?: string): Promise<SearchGuestsResponseDto> {
    if (!name) {
      // Se não há filtro de nome, retorna todos os grupos e convidados individuais
      const groups = await this.guestGroupRepository.find({
        relations: ['guests'],
      });

      const individualGuests = await this.guestRepository.find({
        where: { groupId: IsNull() },
      });

      const groupDtos: GuestGroupResponseDto[] = groups.map(group => ({
        id: group.id,
        name: group.name,
        guests: group.guests.map(guest => ({
          id: guest.id,
          name: guest.name,
          confirmed: guest.confirmed,
          isChild: guest.isChild,
          groupId: guest.groupId,
        })),
      }));

      const individualGuestDtos: GuestResponseDto[] = individualGuests.map(guest => ({
        id: guest.id,
        name: guest.name,
        confirmed: guest.confirmed,
        isChild: guest.isChild,
        groupId: guest.groupId,
      }));

      return {
        groups: groupDtos,
        individualGuests: individualGuestDtos,
      };
    }

    // Buscar convidados que correspondem ao nome (case insensitive)
    const matchingGuests = await this.guestRepository.find({
      where: { name: ILike(`%${name}%`) },
      relations: ['group'],
    });

    // Separar convidados por grupos e individuais
    const groupIds = new Set<number>();
    const individualGuests: Guest[] = [];

    matchingGuests.forEach(guest => {
      if (guest.groupId) {
        groupIds.add(guest.groupId);
      } else {
        individualGuests.push(guest);
      }
    });

    // Buscar grupos completos dos convidados encontrados
    const groups = groupIds.size > 0 
      ? await this.guestGroupRepository.find({
          where: { id: In(Array.from(groupIds)) },
          relations: ['guests'],
        })
      : [];

    // Mapear para DTOs
    const groupDtos: GuestGroupResponseDto[] = groups.map(group => ({
      id: group.id,
      name: group.name,
      guests: group.guests.map(guest => ({
        id: guest.id,
        name: guest.name,
        confirmed: guest.confirmed,
        isChild: guest.isChild,
        groupId: guest.groupId,
      })),
    }));

    const individualGuestDtos: GuestResponseDto[] = individualGuests.map(guest => ({
      id: guest.id,
      name: guest.name,
      confirmed: guest.confirmed,
      isChild: guest.isChild,
      groupId: guest.groupId,
    }));

    return {
      groups: groupDtos,
      individualGuests: individualGuestDtos,
    };
  }

  async confirmGuests(guestIds: number[]): Promise<{ confirmed: number[], notFound: number[] }> {
    const confirmed: number[] = [];
    const notFound: number[] = [];

    for (const guestId of guestIds) {
      const guest = await this.guestRepository.findOne({ where: { id: guestId } });
      
      if (guest) {
        guest.confirmed = true;
        await this.guestRepository.save(guest);
        confirmed.push(guestId);
      } else {
        notFound.push(guestId);
      }
    }

    return { confirmed, notFound };
  }
}