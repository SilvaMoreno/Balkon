import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, permissions: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, isActive: true, permissions: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Utilizador não encontrado');
    return user;
  }

  async create(data: { name: string; email: string; password: string; pin: string; role?: string; permissions?: string[] }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email já registado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        pin: data.pin,
        role: (data.role as any) || 'OPERATOR',
        permissions: data.permissions || [],
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, permissions: true },
    });
  }

  async update(id: string, data: { name?: string; email?: string; password?: string; pin?: string; role?: string; isActive?: boolean; permissions?: string[] }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilizador não encontrado');

    if (data.email && data.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing) throw new ConflictException('Email já registado');
    }

    const updateData: any = { ...data };
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (data.role) updateData.role = data.role as any;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, isActive: true, permissions: true },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilizador não encontrado');
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
