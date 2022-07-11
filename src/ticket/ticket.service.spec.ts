import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Line } from './entities/line.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketService } from './ticket.service';

describe('TicketService', () => {
    let service: TicketService;

    const mockTicketRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockLineRepository = {
        create: jest.fn(),
        save: jest.fn(),
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
            providers: [
                TicketService,
                { provide: getRepositoryToken(Ticket), useValue: mockTicketRepository },
                { provide: getRepositoryToken(Line), useValue: mockLineRepository },
            ],
        }).compile();

        service = module.get<TicketService>(TicketService);
    });

    describe("findAll", () => {
        it("should return all tickets", async () => {
            mockTicketRepository.find.mockResolvedValueOnce(mockTickets);
            const tickets = await service.findAll();
            expect(tickets).toEqual(mockTickets);
        });

        it('should return an empty array', async () => {
            mockTicketRepository.find.mockResolvedValueOnce([]);
            const tickets = await service.findAll();
            expect(tickets).toEqual([]);
        });
    });

    describe("findById", () => {
        it("should return the ticket", async () => {
            mockTicketRepository.findOne.mockResolvedValueOnce(mockTickets[0]);
            const tickets = await service.findById(1);
            expect(tickets).toEqual(mockTickets[0]);
        });

        it('should throw a NotFoundException', async () => {
            mockTicketRepository.findOne.mockResolvedValueOnce(null);
            let err;
            try {
                await service.findById(7);
            } catch(e) {
                err = e;
            }
            expect(err).toBeInstanceOf(NotFoundException);
        });
    });

    describe("create", () => {
        it("should create a ticket", async () => {
            mockTicketRepository.create.mockResolvedValueOnce(mockTickets[2]);
            mockTicketRepository.save.mockResolvedValueOnce(mockTickets[2]);
            const tickets = await service.create(2);
            expect(tickets).toEqual(mockTickets[2]);
        });
    });

    describe("addLinesById", () => {
        it("should return the ticket", async () => {
            mockTicketRepository.findOne.mockResolvedValueOnce(mockTickets[2]);
            mockLineRepository.create.mockResolvedValueOnce(mockTickets[2].lines);
            mockLineRepository.save.mockResolvedValueOnce(mockTickets[2].lines);
            const tickets = await service.addLinesById(3, 2);
            expect(tickets).toEqual(mockTickets[2]);
        });

        it('should throw a NotFoundException', async () => {
            mockTicketRepository.findOne.mockResolvedValueOnce(null);
            let err;
            try {
                await service.addLinesById(7, 2);
            } catch(e) {
                err = e;
            }
            expect(err).toBeInstanceOf(NotFoundException);
        });

        it('should throw a ConflictException', async () => {
            mockTicketRepository.findOne.mockResolvedValueOnce(mockTickets[0]);
            let err;
            try {
                await service.addLinesById(1, 2);
            } catch(e) {
                err = e;
            }
            expect(err).toBeInstanceOf(ConflictException);
        });
    });

});
