import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line } from './entities/line.entity';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
        @InjectRepository(Line) private lineRepository: Repository<Line>,
    ) {}

    findAll(): Promise<Ticket[]> {
        return this.ticketRepository.find({ relations: ['lines'] });
    }

    async findById(id: number): Promise<Ticket> {
        const ticket =  await this.ticketRepository.findOne({ where: { id }, relations: ['lines'] });
        if (!ticket) {
            throw new NotFoundException();
        }
        return ticket;
    }

    create(lines: number): Promise<Ticket> {
        const ticketLines = [];
        for (let i = 0; i < lines; i++) {
            ticketLines.push({ numbers: this.generateLine() });
        }
        const newTicket = this.ticketRepository.create({ lines: ticketLines });
        return this.ticketRepository.save(newTicket);
    }

    async addLinesById(id: number, lines: number): Promise<Ticket> {
        const ticket = await this.findById(id);
        if (ticket.checked) {
            throw new ConflictException();
        }
        const ticketLines = [];
        for (let i = 0; i < lines; i++) {
            ticketLines.push({ ticket, numbers: this.generateLine() });
        }
        const newLines = this.lineRepository.create(ticketLines);
        const pushLines = await this.lineRepository.save(newLines);
        ticket.lines.push(...pushLines);
        return ticket;
    }

    async getStatusById(id: number): Promise<Ticket> {
        const ticket = await this.findById(id);
        ticket.checked = true;
        this.ticketRepository.save(ticket);
        ticket.lines.forEach((line: Line) => {
            line.value = this.evaluateLine(line);
        });
        ticket.lines.sort((a, b) => b.value - a.value);
        ticket.totalValue = ticket.lines.reduce((sum, line) => sum + line.value, 0);
        return ticket;
    }

    

    private generateLine(): string {
        return [
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
        ].join();
    }

    private evaluateLine(line: Line): number {
        const n = line.numbers.split(',').map((i) => parseInt(i));
        // if the sum of the values on a line is 2, the result for that line is 10.
        if (n[0] + n[1] + n[2] === 2) {
            return 10;
        }
        // if they are all the same, the result is 5.
        if (n[0] === n[1] && n[0] === n[2]) {
            return 5;
        }
        // so long as both 2nd and 3rd numbers are different from the 1st, the result is 1.
        if (n[0] !== n[1] && n[0] !== n[2]) {
            return 1;
        }
        // Otherwise the result is 0.
        return 0;
    }
}
