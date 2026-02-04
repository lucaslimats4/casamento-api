import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseGiftsDto {
  @ApiProperty({ 
    description: 'Lista de IDs dos presentes para marcar como comprados',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  giftIds: number[];
}