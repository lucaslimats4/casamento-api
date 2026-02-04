import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { GiftResponseDto } from './dto/gift-response.dto';
import { GetGiftsDto } from './dto/get-gifts.dto';
import { PurchaseGiftsDto } from './dto/purchase-gifts.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

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
}