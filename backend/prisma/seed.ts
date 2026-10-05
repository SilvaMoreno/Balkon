import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@stock.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@stock.com',
      password: adminPassword,
      pin: '1234',
      role: UserRole.ADMIN,
      permissions: [
        'sales:create', 'sales:read',
        'clients:create', 'clients:read', 'clients:update',
        'products:create', 'products:read',
        'payments:create', 'payments:read',
        'cash-closeout:create', 'cash-closeout:read',
        'stock-purchases:create', 'stock-purchases:read',
        'users:manage',
        'audit:read',
        'dashboard:read',
      ],
    },
  });

  const opPassword = await bcrypt.hash('oper123', 10);
  const operator = await prisma.user.upsert({
    where: { email: 'operador@stock.com' },
    update: {},
    create: {
      name: 'Operador',
      email: 'operador@stock.com',
      password: opPassword,
      pin: '0000',
      role: UserRole.OPERATOR,
      permissions: [
        'sales:create', 'sales:read',
        'clients:create', 'clients:read',
        'products:create', 'products:read',
        'payments:create', 'payments:read',
        'cash-closeout:create',
        'stock-purchases:create',
        'dashboard:read',
      ],
    },
  });

  console.log({ admin, operator });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
