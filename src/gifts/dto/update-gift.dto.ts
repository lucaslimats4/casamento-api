import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateGiftDto } from './create-gift.dto';

export class UpdateGiftDto extends PartialType(CreateGiftDto) {
  @ApiProperty({
    description: 'Status de compra do presente',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  purchased?: boolean;
}