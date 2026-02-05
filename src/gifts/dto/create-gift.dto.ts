import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGiftDto {
  @ApiProperty({
    description: 'Título do presente',
    example: 'Jogo de Panelas Antiaderente',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição do presente',
    example: 'Conjunto com 5 panelas antiaderentes de alta qualidade',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Preço do presente em reais',
    example: 299.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'URL da imagem do presente',
    example: 'https://example.com/panelas.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}