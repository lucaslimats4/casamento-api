import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({
    description: 'Nome do convidado',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Se o convidado é uma criança',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isChild?: boolean;

  @ApiProperty({
    description: 'ID do grupo ao qual o convidado pertence',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  groupId?: number;
}