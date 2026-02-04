import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetGiftsDto {
  @ApiPropertyOptional({ 
    description: 'Ordenação por preço',
    enum: ['asc', 'desc'],
    example: 'asc'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByPrice?: 'asc' | 'desc';
}