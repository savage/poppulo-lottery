import { Body, Controller, ClassSerializerInterceptor, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';
import { TicketDto } from './dto/ticket.dto';

@Controller('ticket')
@UseInterceptors(ClassSerializerInterceptor)
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Get()
    getTickets(): Promise<Ticket[]> {
        return this.ticketService.findAll();
    }

    @Get(':id')
    getTicketById(@Param('id') id: number): Promise<Ticket> {
        return this.ticketService.findById(id);
    }

    @Post()
    createTicket(@Body() ticketDto: TicketDto): Promise<Ticket> {
        return this.ticketService.create(ticketDto.lines);
    }

    @Put(':id')
    amendTicket(@Param('id') id: number, @Body() ticketDto: TicketDto): Promise<Ticket> {
        return this.ticketService.addLinesById(id, ticketDto.lines);
    }

    @Get(':id/status')
    getTicketStatus(@Param('id') id: number): Promise<Ticket> {
        return this.ticketService.getStatusById(id);
    }
}
