import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common/interfaces/hooks';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // アプリ起動時にDB接続
  }

  async onModuleDestroy() {
    await this.$disconnect(); // アプリ終了時に切断
  }
}
