import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGuestGroupDto {
  @ApiProperty({
    description: 'Nome do grupo de convidados',
    example: 'Família Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}