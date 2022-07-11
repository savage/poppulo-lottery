import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Line } from './entities/line.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

describe('TicketController', () => {
    let controller: TicketController;
    
    const mockTicketService = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        addLinesById: jest.fn(),
        getStatusById: jest.fn(),
    };
    
    const mockTickets: Ticket[] = [
        {
            id: 1,
            checked: true,
            lines: [
                { id: 1, numbers: "1,1,0" } as Line,
                { id: 2, numbers: "2,2,2" } as Line,
                { id: 3, numbers: "0,1,0" } as Line,
            ],
        } as Ticket,
        {
            id: 2,
            checked: false,
            lines: [
                { id: 4, numbers: "2,1,0" } as Line,
                { id: 5, numbers: "0,2,2" } as Line,
                { id: 6, numbers: "0,0,0" } as Line,
                { id: 7, numbers: "0,2,1" } as Line,
            ],
        } as Ticket,
        {
            id: 3,
            checked: false,
            lines: [
                { id: 8, numbers: "0,1,0" } as Line,
                { id: 9, numbers: "0,0,2" } as Line,
            ],
        } as Ticket,
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TicketController],
            providers: [{ provide: TicketService, useValue: mockTicketService }],
        }).compile();

        controller = module.get<TicketController>(TicketController);
    });

    describe('getTickets', () => {
        it('should return all tickets', async () => {
            mockTicketService.findAll.mockResolvedValueOnce(mockTickets);
            const tickets = await controller.getTickets();
            expect(tickets).toEqual(mockTickets);
        });
    });

    describe('getTicketById', () => {
        it('should return one ticket', async () => {
            mockTicketService.findById.mockResolvedValueOnce(mockTickets[0]);
            const ticket = await controller.getTicketById(1);
            expect(ticket).toEqual(mockTickets[0]);
        });

        it('should throw a NotFoundException', async () => {
            mockTicketService.findById.mockRejectedValueOnce(new NotFoundException);
            let err;
            try {
                await controller.getTicketById(4);
            } catch(e) {
                err = e;
            }
            expect(err).toBeInstanceOf(NotFoundException);
        });
    });
    
    describe('createTicket', () => {
        it('should return the new ticket', async () => {
            mockTicketService.create.mockResolvedValueOnce(mockTickets[2]);
            const ticket = await controller.createTicket({ lines: 2 })
            expect(ticket).toEqual(mockTickets[2]);
        });
    });
    
    describe('amendTicket', () => {
        it('should add lines to the ticket', async () => {
            mockTicketService.addLinesById.mockResolvedValueOnce(mockTickets[2]);
            const ticket = await controller.amendTicket(3, { lines: 2 })
            expect(ticket).toEqual(mockTickets[2]);
        });
        
        it('should throw a ConflictException', async () => {
            mockTicketService.addLinesById.mockRejectedValueOnce(new ConflictException);
            let err;
            try {
                await controller.amendTicket(1, { lines: 2 });
            } catch(e) {
                err = e;
            }
            expect(err).toBeInstanceOf(ConflictException);
        });

        it('should throw a NotFoundException', async () => {
            mockTicketService.addLinesById.mockRejectedValueOnce(new NotFoundException);
            let err;
            try {
                await controller.amendTicket(7, { lines: 2 });
            } catch(e) {
                err = e;
            }
            expect(err).toBeInstanceOf(NotFoundException);
        });
    });
    
    describe('getTicketStatus', () => {
        it('should return the ticket', async () => {
            mockTicketService.getStatusById.mockResolvedValueOnce(mockTickets[0]);
            const ticket = await controller.getTicketStatus(1)
            expect(ticket).toEqual(mockTickets[0]);
        });
    });

});
