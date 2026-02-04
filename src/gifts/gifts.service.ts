import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Gift } from './entities/gift.entity';
import { GiftResponseDto } from './dto/gift-response.dto';

@Injectable()
export class GiftsService {
  private mercadoPagoClient: MercadoPagoConfig;

  constructor(
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    private configService: ConfigService,
  ) {
    // Inicializar cliente do Mercado Pago
    this.mercadoPagoClient = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN'),
    });
  }

  async getGifts(sortByPrice?: 'asc' | 'desc'): Promise<GiftResponseDto[]> {
    let query = this.giftRepository.createQueryBuilder('gift');

    if (sortByPrice) {
      // Presentes comprados aparecem por último
      query = query
        .orderBy('gift.purchased', 'ASC')
        .addOrderBy('gift.price', sortByPrice.toUpperCase() as 'ASC' | 'DESC');
    } else {
      // Ordenação aleatória, mas presentes comprados por último
      // PostgreSQL usa RANDOM() para ordenação aleatória
      query = query
        .orderBy('gift.purchased', 'ASC')
        .addOrderBy('RANDOM()');
    }

    const gifts = await query.getMany();

    return gifts.map(gift => ({
      id: gift.id,
      title: gift.title,
      description: gift.description,
      price: Number(gift.price),
      image: gift.image,
      purchased: gift.purchased,
    }));
  }

  async purchaseGifts(giftIds: number[]): Promise<{ purchased: number[], notFound: number[] }> {
    const purchased: number[] = [];
    const notFound: number[] = [];

    for (const giftId of giftIds) {
      const gift = await this.giftRepository.findOne({ where: { id: giftId } });
      
      if (gift) {
        gift.purchased = true;
        await this.giftRepository.save(gift);
        purchased.push(giftId);
      } else {
        notFound.push(giftId);
      }
    }

    return { purchased, notFound };
  }

  async createCheckout(giftIds: number[]): Promise<{ checkoutUrl: string, notFound: number[] }> {
    const notFound: number[] = [];
    const gifts: Gift[] = [];

    // Buscar os presentes pelos IDs
    for (const giftId of giftIds) {
      const gift = await this.giftRepository.findOne({ where: { id: giftId } });
      
      if (gift && !gift.purchased) {
        gifts.push(gift);
      } else if (!gift) {
        notFound.push(giftId);
      }
    }

    if (gifts.length === 0) {
      throw new Error('Nenhum presente válido encontrado para checkout');
    }

    // Criar preference do Mercado Pago
    const preference = new Preference(this.mercadoPagoClient);

    const items = gifts.map(gift => ({
      id: gift.id.toString(),
      title: gift.title,
      description: gift.description,
      quantity: 1,
      unit_price: Number(gift.price),
      currency_id: 'BRL',
    }));

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:8080');
    const giftIdsParam = gifts.map(g => g.id).join(',');

    try {
      const response = await preference.create({
        body: {
          items,
          back_urls: {
            success: `${frontendUrl}/success?giftIds=${giftIdsParam}`,
            failure: `${frontendUrl}/fails`,
            pending: `${frontendUrl}/success?giftIds=${giftIdsParam}`,
          },
        },
      });

      console.log(response.init_point);

      return {
        checkoutUrl: response.init_point || response.sandbox_init_point,
        notFound,
      };
    } catch (error) {
      console.error('Erro ao criar checkout do Mercado Pago:', error);
      throw new Error('Erro ao criar checkout. Tente novamente.');
    }
  }
}