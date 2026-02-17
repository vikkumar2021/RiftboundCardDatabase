import { Request, Response } from 'express';
import { getCards, getCardById } from '../../controllers/cardController';
import { prisma } from '../../utils/db';

jest.mock('../../utils/db', () => ({
  prisma: {
    card: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
    setex: jest.fn().mockResolvedValue('OK'),
  }));
});

describe('Card Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      query: {},
      params: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCards', () => {
    it('should return paginated cards', async () => {
      const mockCards = [
        { id: '1', name: 'Test Card', cost: 1 },
        { id: '2', name: 'Test Card 2', cost: 2 },
      ];

      (prisma.card.findMany as jest.Mock).mockResolvedValue(mockCards);
      (prisma.card.count as jest.Mock).mockResolvedValue(2);

      await getCards(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        cards: mockCards,
        total: 2,
        page: 1,
        pageSize: 20,
      });
    });
  });

  describe('getCardById', () => {
    it('should return card when found', async () => {
      const mockCard = { id: '1', name: 'Test Card', cost: 1 };

      (prisma.card.findUnique as jest.Mock).mockResolvedValue(mockCard);

      mockRequest.params = { id: '1' };

      await getCardById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCard);
    });

    it('should return 404 when card not found', async () => {
      (prisma.card.findUnique as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: '999' };

      await getCardById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });
  });
});
