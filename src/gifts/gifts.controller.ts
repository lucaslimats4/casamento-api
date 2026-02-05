import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { GiftResponseDto } from './dto/gift-response.dto';
import { GetGiftsDto } from './dto/get-gifts.dto';
import { PurchaseGiftsDto } from './dto/purchase-gifts.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('gifts')
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os presentes' })
  @ApiQuery({ 
    name: 'sortByPrice', 
    required: false, 
    enum: ['asc', 'desc'],
    description: 'Ordenar por preço (asc = menor para maior, desc = maior para menor). Se não informado, retorna aleatoriamente.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presentes retornada com sucesso',
    type: [GiftResponseDto],
  })
  async getGifts(@Query() query: GetGiftsDto): Promise<GiftResponseDto[]> {
    return this.giftsService.getGifts(query.sortByPrice);
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Marcar presentes como comprados' })
  @ApiResponse({
    status: 200,
    description: 'Presentes marcados como comprados com sucesso',
    schema: {
      type: 'object',
      properties: {
        purchased: {
          type: 'array',
          items: { type: 'number' },
          description: 'IDs dos presentes que foram marcados como comprados'
        },
        notFound: {
          type: 'array',
          items: { type: 'number' },
          description: 'IDs dos presentes que não foram encontrados'
        }
      }
    }
  })
  async purchaseGifts(@Body() purchaseGiftsDto: PurchaseGiftsDto) {
    return this.giftsService.purchaseGifts(purchaseGiftsDto.giftIds);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Criar checkout do Mercado Pago para presentes' })
  @ApiResponse({
    status: 200,
    description: 'Checkout criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        checkoutUrl: {
          type: 'string',
          description: 'URL do checkout do Mercado Pago'
        },
        notFound: {
          type: 'array',
          items: { type: 'number' },
          description: 'IDs dos presentes que não foram encontrados'
        }
      }
    }
  })
  async createCheckout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.giftsService.createCheckout(createCheckoutDto.giftIds);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatísticas dos presentes (rota protegida)' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', description: 'Total de presentes' },
        purchased: { type: 'number', description: 'Presentes comprados' },
        available: { type: 'number', description: 'Presentes disponíveis' },
        totalValue: { type: 'number', description: 'Valor total dos presentes' },
        purchasedValue: { type: 'number', description: 'Valor dos presentes comprados' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getGiftStats() {
    return this.giftsService.getGiftStats();
  }

  // ========== ROTAS ADMINISTRATIVAS PROTEGIDAS ==========

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo presente (rota protegida)' })
  @ApiResponse({
    status: 201,
    description: 'Presente criado com sucesso',
    type: GiftResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createGift(@Body() createGiftDto: CreateGiftDto): Promise<GiftResponseDto> {
    return this.giftsService.createGift(createGiftDto);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar presente por ID (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do presente', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Presente encontrado',
    type: GiftResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async getGiftById(@Param('id', ParseIntPipe) id: number): Promise<GiftResponseDto> {
    return this.giftsService.getGiftById(id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar presente (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do presente', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Presente atualizado com sucesso',
    type: GiftResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updateGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGiftDto: UpdateGiftDto,
  ): Promise<GiftResponseDto> {
    return this.giftsService.updateGift(id, updateGiftDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar presente (rota protegida)' })
  @ApiParam({ name: 'id', description: 'ID do presente', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Presente deletado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Presente deletado com sucesso' },
        id: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  @ApiResponse({ status: 404, description: 'Presente não encontrado' })
  async deleteGift(@Param('id', ParseIntPipe) id: number) {
    return this.giftsService.deleteGift(id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os presentes para administração (rota protegida)' })
  @ApiQuery({ 
    name: 'sortByPrice', 
    required: false, 
    enum: ['asc', 'desc'],
    description: 'Ordenar por preço'
  })
  @ApiQuery({ 
    name: 'purchased', 
    required: false, 
    type: 'boolean',
    description: 'Filtrar por status de compra (true = comprados, false = disponíveis)'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presentes para administração',
    type: [GiftResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido' })
  async getGiftsAdmin(
    @Query('sortByPrice') sortByPrice?: 'asc' | 'desc',
    @Query('purchased') purchased?: boolean,
  ): Promise<GiftResponseDto[]> {
    return this.giftsService.getGiftsAdmin(sortByPrice, purchased);
  }
}