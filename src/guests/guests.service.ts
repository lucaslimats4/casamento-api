import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, IsNull, ILike } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { GuestGroup } from './entities/guest-group.entity';
import { SearchGuestsResponseDto, GuestGroupResponseDto, GuestResponseDto } from './dto/guest-response.dto';
import { CreateGuestGroupDto } from './dto/create-guest-group.dto';
import { UpdateGuestGroupDto } from './dto/update-guest-group.dto';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

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

  // ========== MÉTODOS ADMINISTRATIVOS ==========

  // GRUPOS DE CONVIDADOS
  async getGuestGroups(): Promise<GuestGroupResponseDto[]> {
    const groups = await this.guestGroupRepository.find({
      relations: ['guests'],
      order: { name: 'ASC' },
    });

    return groups.map(group => ({
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
  }

  async createGuestGroup(createGroupDto: CreateGuestGroupDto): Promise<GuestGroupResponseDto> {
    const group = this.guestGroupRepository.create({
      name: createGroupDto.name,
    });

    const savedGroup = await this.guestGroupRepository.save(group);

    return {
      id: savedGroup.id,
      name: savedGroup.name,
      guests: [],
    };
  }

  async getGuestGroupById(id: number): Promise<GuestGroupResponseDto> {
    const group = await this.guestGroupRepository.findOne({
      where: { id },
      relations: ['guests'],
    });

    if (!group) {
      throw new NotFoundException(`Grupo com ID ${id} não encontrado`);
    }

    return {
      id: group.id,
      name: group.name,
      guests: group.guests.map(guest => ({
        id: guest.id,
        name: guest.name,
        confirmed: guest.confirmed,
        isChild: guest.isChild,
        groupId: guest.groupId,
      })),
    };
  }

  async updateGuestGroup(id: number, updateGroupDto: UpdateGuestGroupDto): Promise<GuestGroupResponseDto> {
    const group = await this.guestGroupRepository.findOne({
      where: { id },
      relations: ['guests'],
    });

    if (!group) {
      throw new NotFoundException(`Grupo com ID ${id} não encontrado`);
    }

    if (updateGroupDto.name !== undefined) {
      group.name = updateGroupDto.name;
    }

    const updatedGroup = await this.guestGroupRepository.save(group);

    return {
      id: updatedGroup.id,
      name: updatedGroup.name,
      guests: updatedGroup.guests.map(guest => ({
        id: guest.id,
        name: guest.name,
        confirmed: guest.confirmed,
        isChild: guest.isChild,
        groupId: guest.groupId,
      })),
    };
  }

  async deleteGuestGroup(id: number): Promise<{ message: string; id: number }> {
    const group = await this.guestGroupRepository.findOne({
      where: { id },
      relations: ['guests'],
    });

    if (!group) {
      throw new NotFoundException(`Grupo com ID ${id} não encontrado`);
    }

    // Remover a associação dos convidados com o grupo
    if (group.guests.length > 0) {
      await this.guestRepository.update(
        { groupId: id },
        { groupId: null }
      );
    }

    await this.guestGroupRepository.remove(group);

    return {
      message: 'Grupo deletado com sucesso',
      id,
    };
  }

  // CONVIDADOS INDIVIDUAIS
  async getGuests(confirmed?: boolean, groupId?: number): Promise<GuestResponseDto[]> {
    const where: any = {};
    
    if (confirmed !== undefined) {
      where.confirmed = confirmed;
    }
    
    if (groupId !== undefined) {
      where.groupId = groupId;
    }

    const guests = await this.guestRepository.find({
      where,
      relations: ['group'],
      order: { name: 'ASC' },
    });

    return guests.map(guest => ({
      id: guest.id,
      name: guest.name,
      confirmed: guest.confirmed,
      isChild: guest.isChild,
      groupId: guest.groupId,
      groupName: guest.group?.name,
    }));
  }

  async createGuest(createGuestDto: CreateGuestDto): Promise<GuestResponseDto> {
    // Verificar se o grupo existe (se fornecido)
    if (createGuestDto.groupId) {
      const group = await this.guestGroupRepository.findOne({
        where: { id: createGuestDto.groupId },
      });
      
      if (!group) {
        throw new NotFoundException(`Grupo com ID ${createGuestDto.groupId} não encontrado`);
      }
    }

    const guest = this.guestRepository.create({
      name: createGuestDto.name,
      isChild: createGuestDto.isChild || false,
      groupId: createGuestDto.groupId,
      confirmed: false,
    });

    const savedGuest = await this.guestRepository.save(guest);

    // Buscar o convidado com o grupo para retornar o nome do grupo
    const guestWithGroup = await this.guestRepository.findOne({
      where: { id: savedGuest.id },
      relations: ['group'],
    });

    return {
      id: guestWithGroup.id,
      name: guestWithGroup.name,
      confirmed: guestWithGroup.confirmed,
      isChild: guestWithGroup.isChild,
      groupId: guestWithGroup.groupId,
      groupName: guestWithGroup.group?.name,
    };
  }

  async getGuestById(id: number): Promise<GuestResponseDto> {
    const guest = await this.guestRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!guest) {
      throw new NotFoundException(`Convidado com ID ${id} não encontrado`);
    }

    return {
      id: guest.id,
      name: guest.name,
      confirmed: guest.confirmed,
      isChild: guest.isChild,
      groupId: guest.groupId,
      groupName: guest.group?.name,
    };
  }

  async updateGuest(id: number, updateGuestDto: UpdateGuestDto): Promise<GuestResponseDto> {
    const guest = await this.guestRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!guest) {
      throw new NotFoundException(`Convidado com ID ${id} não encontrado`);
    }

    // Verificar se o novo grupo existe (se fornecido)
    if (updateGuestDto.groupId !== undefined && updateGuestDto.groupId !== null) {
      const group = await this.guestGroupRepository.findOne({
        where: { id: updateGuestDto.groupId },
      });
      
      if (!group) {
        throw new NotFoundException(`Grupo com ID ${updateGuestDto.groupId} não encontrado`);
      }
    }

    // Atualizar apenas os campos fornecidos
    if (updateGuestDto.name !== undefined) {
      guest.name = updateGuestDto.name;
    }
    if (updateGuestDto.isChild !== undefined) {
      guest.isChild = updateGuestDto.isChild;
    }
    if (updateGuestDto.confirmed !== undefined) {
      guest.confirmed = updateGuestDto.confirmed;
    }
    if (updateGuestDto.groupId !== undefined) {
      guest.groupId = updateGuestDto.groupId;
    }

    const updatedGuest = await this.guestRepository.save(guest);

    // Buscar novamente com o grupo atualizado
    const guestWithGroup = await this.guestRepository.findOne({
      where: { id: updatedGuest.id },
      relations: ['group'],
    });

    return {
      id: guestWithGroup.id,
      name: guestWithGroup.name,
      confirmed: guestWithGroup.confirmed,
      isChild: guestWithGroup.isChild,
      groupId: guestWithGroup.groupId,
      groupName: guestWithGroup.group?.name,
    };
  }

  async deleteGuest(id: number): Promise<{ message: string; id: number }> {
    const guest = await this.guestRepository.findOne({ where: { id } });

    if (!guest) {
      throw new NotFoundException(`Convidado com ID ${id} não encontrado`);
    }

    await this.guestRepository.remove(guest);

    return {
      message: 'Convidado deletado com sucesso',
      id,
    };
  }

  async getGuestStats() {
    const [guests, totalGuests] = await this.guestRepository.findAndCount();
    const [groups, totalGroups] = await this.guestGroupRepository.findAndCount();
    
    const confirmedGuests = guests.filter(guest => guest.confirmed).length;
    const pendingGuests = totalGuests - confirmedGuests;
    const adultsCount = guests.filter(guest => !guest.isChild).length;
    const childrenCount = guests.filter(guest => guest.isChild).length;

    return {
      totalGuests,
      confirmedGuests,
      pendingGuests,
      totalGroups,
      adultsCount,
      childrenCount,
    };
  }
}