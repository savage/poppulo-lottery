import { IsInt, IsPositive } from 'class-validator';

export class TicketDto {
    @IsInt()
    @IsPositive()
    lines: number;
}