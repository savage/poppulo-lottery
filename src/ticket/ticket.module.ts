import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Line } from './entities/line.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Line])],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {}
