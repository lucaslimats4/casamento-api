import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateGuestDto } from './create-guest.dto';

export class UpdateGuestDto extends PartialType(CreateGuestDto) {
  @ApiProperty({
    description: 'Status de confirmação do convidado',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;
}