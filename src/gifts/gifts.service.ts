import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Gift } from './entities/gift.entity';
import { GiftResponseDto } from './dto/gift-response.dto';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

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

  async getGiftStats() {
    const [gifts, total] = await this.giftRepository.findAndCount();
    
    const purchased = gifts.filter(gift => gift.purchased).length;
    const available = total - purchased;
    
    const totalValue = gifts.reduce((sum, gift) => sum + Number(gift.price), 0);
    const purchasedValue = gifts
      .filter(gift => gift.purchased)
      .reduce((sum, gift) => sum + Number(gift.price), 0);

    return {
      total,
      purchased,
      available,
      totalValue,
      purchasedValue,
    };
  }

  // ========== MÉTODOS ADMINISTRATIVOS ==========

  async createGift(createGiftDto: CreateGiftDto): Promise<GiftResponseDto> {
    const gift = this.giftRepository.create({
      title: createGiftDto.title,
      description: createGiftDto.description,
      price: createGiftDto.price,
      image: createGiftDto.image,
      purchased: false,
    });

    const savedGift = await this.giftRepository.save(gift);

    return {
      id: savedGift.id,
      title: savedGift.title,
      description: savedGift.description,
      price: Number(savedGift.price),
      image: savedGift.image,
      purchased: savedGift.purchased,
    };
  }

  async getGiftById(id: number): Promise<GiftResponseDto> {
    const gift = await this.giftRepository.findOne({ where: { id } });

    if (!gift) {
      throw new NotFoundException(`Presente com ID ${id} não encontrado`);
    }

    return {
      id: gift.id,
      title: gift.title,
      description: gift.description,
      price: Number(gift.price),
      image: gift.image,
      purchased: gift.purchased,
    };
  }

  async updateGift(id: number, updateGiftDto: UpdateGiftDto): Promise<GiftResponseDto> {
    const gift = await this.giftRepository.findOne({ where: { id } });

    if (!gift) {
      throw new NotFoundException(`Presente com ID ${id} não encontrado`);
    }

    // Atualizar apenas os campos fornecidos
    if (updateGiftDto.title !== undefined) {
      gift.title = updateGiftDto.title;
    }
    if (updateGiftDto.description !== undefined) {
      gift.description = updateGiftDto.description;
    }
    if (updateGiftDto.price !== undefined) {
      gift.price = updateGiftDto.price;
    }
    if (updateGiftDto.image !== undefined) {
      gift.image = updateGiftDto.image;
    }
    if (updateGiftDto.purchased !== undefined) {
      gift.purchased = updateGiftDto.purchased;
    }

    const updatedGift = await this.giftRepository.save(gift);

    return {
      id: updatedGift.id,
      title: updatedGift.title,
      description: updatedGift.description,
      price: Number(updatedGift.price),
      image: updatedGift.image,
      purchased: updatedGift.purchased,
    };
  }

  async deleteGift(id: number): Promise<{ message: string; id: number }> {
    const gift = await this.giftRepository.findOne({ where: { id } });

    if (!gift) {
      throw new NotFoundException(`Presente com ID ${id} não encontrado`);
    }

    await this.giftRepository.remove(gift);

    return {
      message: 'Presente deletado com sucesso',
      id,
    };
  }

  async getGiftsAdmin(sortByPrice?: 'asc' | 'desc', purchased?: boolean): Promise<GiftResponseDto[]> {
    let query = this.giftRepository.createQueryBuilder('gift');

    // Filtrar por status de compra se especificado
    if (purchased !== undefined) {
      query = query.where('gift.purchased = :purchased', { purchased });
    }

    // Ordenar por preço se especificado
    if (sortByPrice) {
      query = query.orderBy('gift.price', sortByPrice.toUpperCase() as 'ASC' | 'DESC');
    } else {
      // Ordenação padrão por ID
      query = query.orderBy('gift.id', 'ASC');
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
}