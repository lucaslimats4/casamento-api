import { ApiProperty } from '@nestjs/swagger';

export class GuestResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  confirmed: boolean;

  @ApiProperty()
  isChild: boolean;

  @ApiProperty({ required: false })
  groupId?: number;

  @ApiProperty({ required: false })
  groupName?: string;
}

export class GuestGroupResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [GuestResponseDto] })
  guests: GuestResponseDto[];
}

export class SearchGuestsResponseDto {
  @ApiProperty({ type: [GuestGroupResponseDto] })
  groups: GuestGroupResponseDto[];

  @ApiProperty({ type: [GuestResponseDto] })
  individualGuests: GuestResponseDto[];
}