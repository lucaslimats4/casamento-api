import { IsArray, IsInt, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty({ 
    description: 'Lista de IDs dos presentes para checkout',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um presente selecionado' })
  @IsInt({ each: true })
  giftIds: number[];
}