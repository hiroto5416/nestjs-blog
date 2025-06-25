import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function resetDatabase() {
  await prisma.post.deleteMany();
}
