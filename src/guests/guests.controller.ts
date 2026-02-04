import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { SearchGuestsDto } from './dto/search-guests.dto';
import { ConfirmGuestsDto } from './dto/confirm-guests.dto';
import { SearchGuestsResponseDto } from './dto/guest-response.dto';

@ApiTags('guests')
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar convidados por nome' })
  @ApiQuery({ name: 'name', required: false, description: 'Nome para buscar' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de grupos e convidados encontrados',
    type: SearchGuestsResponseDto 
  })
  async searchGuests(@Query() searchDto: SearchGuestsDto): Promise<SearchGuestsResponseDto> {
    return this.guestsService.searchGuests(searchDto.name);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar presença de convidados' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resultado da confirmação',
    schema: {
      type: 'object',
      properties: {
        confirmed: {
          type: 'array',
          items: { type: 'number' },
          description: 'IDs dos convidados confirmados com sucesso'
        },
        notFound: {
          type: 'array',
          items: { type: 'number' },
          description: 'IDs dos convidados não encontrados'
        }
      }
    }
  })
  async confirmGuests(@Body() confirmDto: ConfirmGuestsDto) {
    return this.guestsService.confirmGuests(confirmDto.guestIds);
  }
}