import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call prisma.post.create with correct data', async () => {
    const dto = { title: 'Test', content: 'Content' };
    await service.create(dto);

    expect(mockPrismaService.post.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should call prisma.post.findMany and log a message', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    await service.findAll();

    expect(mockPrismaService.post.findMany).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('記事一覧を取得します');

    logSpy.mockRestore();
  });

  it('should call prisma.post.findUnique with correct id', async () => {
    await service.findOne(42);

    expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
      where: { id: 42 },
    });
  });

  it('should call prisma.post.update with correct id and data', async () => {
    const dto = { title: 'Updated', content: 'Updated content' };

    await service.update(99, dto);

    expect(mockPrismaService.post.update).toHaveBeenCalledWith({
      where: { id: 99 },
      data: dto,
    });
  });

  it('should call prisma.post.delete with correct id', async () => {
    await service.remove(7);

    expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
      where: { id: 7 },
    });
  });
});
