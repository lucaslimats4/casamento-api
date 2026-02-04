import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmGuestsDto {
  @ApiProperty({ 
    description: 'Lista de IDs dos convidados para confirmar presença',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  guestIds: number[];
}