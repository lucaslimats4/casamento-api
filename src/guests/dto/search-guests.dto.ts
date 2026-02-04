import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchGuestsDto {
  @ApiPropertyOptional({ description: 'Nome para buscar convidados' })
  @IsOptional()
  @IsString()
  name?: string;
}