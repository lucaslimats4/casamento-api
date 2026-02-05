import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { SearchGuestsDto } from './dto/search-guests.dto';
import { ConfirmGuestsDto } from './dto/confirm-guests.dto';
import { SearchGuestsResponseDto } from './dto/guest-response.dto';
import { CreateGuestGroupDto } from './dto/create-guest-group.dto';
import { UpdateGuestGroupDto } from './dto/update-guest-group.dto';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  // ========== ROTAS ADMINISTRATIVAS PROTEGIDAS ==========

  // GRUPOS DE CONVIDADOS
  @Get('admin/groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os grupos de convidados (rota protegida)' })
  @ApiResponse({ status: 200, description: 'Lista de grupos retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getGuestGroups() {
    return this.guestsService.getGuestGroups();
  }

  @Post('admin/groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo grupo de convidados (rota protegida)' })
  @ApiResponse({ status: 201, description: 'Grupo criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createGuestGroup(@Body() createGroupDto: CreateGuestGroupDto) {
    return this.guestsService.createGuestGroup(createGroupDto);
  }

  @Get('admin/groups/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar grupo por ID (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do grupo', type: 'number' })
  @ApiResponse({ status: 200, description: 'Grupo encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  async getGuestGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.getGuestGroupById(id);
  }

  @Put('admin/groups/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar grupo de convidados (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do grupo', type: 'number' })
  @ApiResponse({ status: 200, description: 'Grupo atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updateGuestGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGuestGroupDto,
  ) {
    return this.guestsService.updateGuestGroup(id, updateGroupDto);
  }

  @Delete('admin/groups/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar grupo de convidados (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do grupo', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Grupo deletado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Grupo deletado com sucesso' },
        id: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  async deleteGuestGroup(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.deleteGuestGroup(id);
  }

  // CONVIDADOS INDIVIDUAIS
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os convidados (rota protegida)' })
  @ApiQuery({ name: 'confirmed', required: false, type: 'boolean', description: 'Filtrar por confirmação' })
  @ApiQuery({ name: 'groupId', required: false, type: 'number', description: 'Filtrar por grupo' })
  @ApiResponse({ status: 200, description: 'Lista de convidados retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getGuests(
    @Query('confirmed') confirmed?: boolean,
    @Query('groupId', new ParseIntPipe({ optional: true })) groupId?: number,
  ) {
    return this.guestsService.getGuests(confirmed, groupId);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo convidado (rota protegida)' })
  @ApiResponse({ status: 201, description: 'Convidado criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createGuest(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.createGuest(createGuestDto);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatísticas dos convidados (rota protegida)' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalGuests: { type: 'number', description: 'Total de convidados' },
        confirmedGuests: { type: 'number', description: 'Convidados confirmados' },
        pendingGuests: { type: 'number', description: 'Convidados pendentes' },
        totalGroups: { type: 'number', description: 'Total de grupos' },
        adultsCount: { type: 'number', description: 'Número de adultos' },
        childrenCount: { type: 'number', description: 'Número de crianças' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getGuestStats() {
    return this.guestsService.getGuestStats();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar convidado por ID (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do convidado', type: 'number' })
  @ApiResponse({ status: 200, description: 'Convidado encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Convidado não encontrado' })
  async getGuestById(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.getGuestById(id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar convidado (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do convidado', type: 'number' })
  @ApiResponse({ status: 200, description: 'Convidado atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Convidado não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updateGuest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestsService.updateGuest(id, updateGuestDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar convidado (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do convidado', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Convidado deletado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Convidado deletado com sucesso' },
        id: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Convidado não encontrado' })
  async deleteGuest(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.deleteGuest(id);
  }
}