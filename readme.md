
# 📦 Express + TypeScript (Node 24)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

Framework **minimalista y funcional** para APIs TypeScript sin dependencias pesadas. Creado sobre Clean Architecture, Hexagonal Architecture y Domain-Driven Design principles. Tiene un setup **minimalista, moderno y listo para producción** (2025). Node 24 + **ESM nativo**. `tsx` para dev (rápido, sin hacks). `tsc` solo para build. Sin Babel, sin nodemon.

## 📋 Filosofía del pseudo framework

### **Arquitectura Funcional Minimalista**
- **Cero clases**: Solo `factory functions` para máxima simplicidad y predictibilidad
- **Type safety**: TypeScript exhaustivo en toda la aplicación
- **Zero dependencies**: Solo lo que necesitas, sin frameworks pesados
- **Functional programming**: Closures sobre dependencias explícitas

### **Principios Fundamentales**
- **Hexagonal Architecture**: Desacoplamiento total de infraestructura
- **Clean Architecture**: Separación clara de responsabilidades
- **Domain-Driven Design**: Dominio como corazón del sistema
- **Dependency Injection**: Sin frameworks, solo funciones puras

## 🏛️ Arquitectura del pseudo framework

### **Estructura del Proyecto**
```
src/
├── domain/              # Corazón de negocio - NO depende de nada
│   ├── result.ts        # Result<T> pattern para manejo de errores
│   ├── mappers.ts       # Mappers entre dominio y API externa
│   ├── [types].ts       # Entidades de dominio
│   └── ports/           # Contratos con el mundo exterior
├── application/         # Casos de uso
├── providers/           # Dependency injection
├── adapters/            # Implementaciones concretas de ports
├── [features]/          # Endpoints específicos (users, orders, etc.)
└── common/              # Funcionalidades transversales
```

### **Layer Dependencies**
```
┌─────────────────┐
│ Infrastructure  │ → Controllers, Routes, API
├─────────────────┤
│ Application     │ → Casos de uso, orquestación
├─────────────────┤
│ Adapters        │ → Implementaciones de ports
├─────────────────┤
│ Domain          │ ← Corazón (sin dependencias)
└─────────────────┘
```


## 🔌 Patrón: Ports & Adapters

### **Concepto Hexagonal**
Los **Ports** definen contratos (qué se puede hacer) y los **Adapters** implementan cómo se hace.

### **Ejemplo Demostrativo: Cache**

#### **1. Port Definition (Contrato)**
```typescript
// src/domain/ports/cache.ts
import { Result } from '../result.js';

/**
 * Repositorio de cache - contrato puro sin implementación
 */
export interface CacheRepository {
  get<T>(key: string): Promise<Result<T | null>>;
  set<T>(key: string, value: T, ttl?: number): Promise<Result<void>>;
  delete(key: string): Promise<Result<void>>;
  exists(key: string): Promise<Result<boolean>>;
}
```

#### **2. Adapter Implementation (Implementación concreta)**
```typescript
// src/adapters/redis-cache.ts
import { Result } from '#domain';
import type { CacheRepository } from '#ports';
import type { Redis } from 'ioredis';

/**
 * Adapter de Redis para el port CacheRepository
 * Implementa el contrato usando Redis como tecnología
 */
export function RedisCacheAdapter(redisClient: Redis): CacheRepository {
  
  return {
    async get<T>(key: string): Promise<Result<T | null>> {
      try {
        const value = await redisClient.get(key);
        const parsed = value ? JSON.parse(value) : null;
        
        return {
          isOk: true,
          data: parsed,
          mssg: 'Success'
        };
      } catch (error) {
        return {
          isOk: false,
          mssg: `Redis get error: ${error.message}`,
          error: { code: 'REDIS_GET_ERROR' }
        };
      }
    },

    async set<T>(key: string, value: T, ttl = 3600): Promise<Result<void>> {
      try {
        const serialized = JSON.stringify(value);
        await redisClient.setex(key, ttl, serialized);
        
        return {
          isOk: true,
          mssg: 'Value cached successfully'
        };
      } catch (error) {
        return {
          isOk: false,
          mssg: `Redis set error: ${error.message}`,
          error: { code: 'REDIS_SET_ERROR' }
        };
      }
    },

    async delete(key: string): Promise<Result<void>> {
      try {
        await redisClient.del(key);
        return {
          isOk: true,
          mssg: 'Key deleted successfully'
        };
      } catch (error) {
        return {
          isOk: false,
          mssg: `Redis delete error: ${error.message}`,
          error: { code: 'REDIS_DELETE_ERROR' }
        };
      }
    },

    async exists(key: string): Promise<Result<boolean>> {
      try {
        const exists = await redisClient.exists(key);
        return {
          isOk: true,
          data: exists === 1,
          mssg: 'Success'
        };
      } catch (error) {
        return {
          isOk: false,
          mssg: `Redis exists error: ${error.message}`,
          error: { code: 'REDIS_EXISTS_ERROR' }
        };
      }
    }
  };
}
```

#### **3. Provider (Dependency Injection)**
```typescript
// src/providers/cache.ts
import { CacheRepository } from '#ports';
import { RedisCacheAdapter } from '#adapters';
import { Redis } from 'ioredis';

/**
 * Provider pattern - Centraliza configuración y dependencias
 */
export function CacheProvider(type: 'redis' | 'memory' = 'redis'): CacheRepository {
  switch (type) {
    case 'redis': {
      const redisClient = new Redis(process.env.REDIS_URL);
      return RedisCacheAdapter(redisClient);
    }
    case 'memory': {
      return MemoryCacheAdapter(); // Otra implementación posible
    }
    default:
      throw new Error(`Cache type ${type} not supported`);
  }
}
```

#### **4. Uso en la Application Layer**
```typescript
// src/application/user.ts
import type { CacheRepository } from '#ports';
import type { User } from '#domain';

/**
 * Caso de uso: Obtener usuario con cache
 */
export async function getUserById(
  userId: string,
  cacheRepo: CacheRepository,
  userRepo: UserRepository
): Promise<Result<User>> {
  // 1. Intentar obtener desde cache
  const cacheResult = await cacheRepo.get<User>(`user:${userId}`);
  
  if (cacheResult.isOk && cacheResult.data) {
    return {
      isOk: true,
      data: cacheResult.data,
      mssg: 'User retrieved from cache'
    };
  }

  // 2. Obtener desde base de datos
  const dbResult = await userRepo.findById(userId);
  
  if (dbResult.isOk && dbResult.data) {
    // 3. Guardar en cache para futuras consultas
    await cacheRepo.set(`user:${userId}`, dbResult.data, 300);
    
    return dbResult;
  }

  return dbResult;
}
```

## 🛠️ Development Workflow

### **Guía paso a paso: Añadir "Users" Feature**

#### **1. Domain Types**
```typescript
// src/domain/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}
```

#### **2. Port Definition**
```typescript
// src/domain/ports/user.ts
import { Result } from '../result.js';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user.js';

export interface UserRepository {
  findById(id: string): Promise<Result<User | null>>;
  findByEmail(email: string): Promise<Result<User | null>>;
  create(userData: CreateUserRequest): Promise<Result<User>>;
  update(id: string, userData: UpdateUserRequest): Promise<Result<User>>;
  delete(id: string): Promise<Result<void>>;
  findAll(limit?: number): Promise<Result<User[]>>;
}
```

#### **3. Adapter Implementation**
```typescript
// src/adapters/database-user.ts
import { Result, mapToResult } from '#domain';
import type { UserRepository } from '#ports';
import type { User, CreateUserRequest, UpdateUserRequest } from '#domain';
import type { DatabaseConnection } from 'some-db-lib';

export function DatabaseUserAdapter(db: DatabaseConnection): UserRepository {
  return {
    async findById(id: string): Promise<Result<User | null>> {
      try {
        const row = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (!row) {
          return { isOk: true, data: null, mssg: 'User not found' };
        }

        const user: User = {
          id: row.id,
          email: row.email,
          name: row.name,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        };

        return { isOk: true, data: user, mssg: 'User found' };
      } catch (error) {
        return { 
          isOk: false, 
          mssg: `Database error: ${error.message}`,
          error: { code: 'DB_FIND_ERROR' }
        };
      }
    },

    // ... implementación de otros métodos
  };
}
```

#### **4. Provider**
```typescript
// src/providers/user.ts
import { UserRepository } from '#ports';
import { DatabaseUserAdapter } from '#adapters';
import { createDatabaseConnection } from '../utils/database.js';

export function UserProvider(): UserRepository {
  const db = createDatabaseConnection();
  return DatabaseUserAdapter(db);
}
```

#### **5. Application Layer**
```typescript
// src/application/user.ts
import type { UserRepository } from '#ports';
import type { User, CreateUserRequest } from '#domain';

export async function createUser(
  userData: CreateUserRequest,
  userRepo: UserRepository
): Promise<Result<User>> {
  // Validaciones de negocio
  const existingUser = await userRepo.findByEmail(userData.email);
  if (existingUser.isOk && existingUser.data) {
    return {
      isOk: false,
      mssg: 'Email already exists',
      error: { code: 'EMAIL_EXISTS' }
    };
  }

  // Creación del usuario
  return userRepo.create(userData);
}
```

#### **6. Infrastructure Layer**
```typescript
// src/users/controllers.ts
import type { UserRepository } from '#ports';
import { createUser } from '#application';
import type { CreateUserRequest } from '#domain';
import { Request, Response } from 'express';

export const createUserEndpoint = (userRepo: UserRepository) => 
  async (req: Request, res: Response) => {
    const userData = req.body as CreateUserRequest;
    const result = await createUser(userData, userRepo);
    
    res.status(result.isOk ? 201 : 400).json(result);
  };

export const getUserByIdEndpoint = (userRepo: UserRepository) => 
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userRepo.findById(id);
    
    res.status(result.isOk ? 200 : 404).json(result);
  };
```

```typescript
// src/users/routes.ts
import express from 'express';
import * as controller from './controllers.js';
import type { UserRepository } from '#ports';

export default function userRoutes(userRepo: UserRepository) {
  const router = express.Router();
  
  router.post('/', controller.createUserEndpoint(userRepo));
  router.get('/:id', controller.getUserByIdEndpoint(userRepo));
  
  return router;
}
```

#### **7. API Integration**
```typescript
// src/api.ts
import { UserProvider } from '#providers';
import { SapProvider } from '#providers';
import orderRoutes from '#src/orders/routes.js';
import userRoutes from '#src/users/routes.js';

// Providers
const sap = SapProvider(true);
const users = UserProvider();

// Routes
api.use('/users', userRoutes(users));
```


## 🔄 Comparación

| Concepto | Express Tradicional | NestJS | **pseudo framework** |
|----------|-------------------|--------|-------------------|
| **Setup Complexity** | Baja | Alta | **Media** |
| **Dependencies** | Mínimas | 50+ | **Mínimas** |
| **Type Safety** | Manual | Completa | **Completa** |
| **Learning Curve** | Baja | Empinada | **Media** |
| **Performance** | Buena | Moderada | **Excelente** |
| **Bundle Size** | Pequeño | Grande | **Óptimo** |
| **Testability** | Manual | Framework | **Control Total** |
| **Flexibility** | Media | Opinado | **Total** |
| **Maintenance** | Caótico | Framework | **Sostenible** |

## 🎖️ Ventajas del pseudo framework

### **Ventajas Principales**
- ✅ **Minimalismo**: Solo lo necesario, zero bloat
- ✅ **Type Safety**: TypeScript exhaustivo en runtime
- ✅ **Performance**: Sin overhead de frameworks
- ✅ **Testing**: Mock fácil y control total
- ✅ **Maintenance**: Arquitectura predecible y sostenible
- ✅ **Learning**: Patrones universales, no lock-in
- ✅ **Scalability**: Fácil extensión sin refactor

### **Casos de Uso Ideales**
- **APIs RESTful**: Perfecto para servicios web
- **Microservicios**: Ligero y desacoplado
- **Enterprise APIs**: Arquitectura profesional
- **Startups**: Rápido desarrollo, mantenible
- **Educación**: Patrones claros y enseñables

## 🚀 Quick Start

### **Instalación**
```bash
npm install
npm run dev
```

### **Desarrollo**
```bash
npm run dev    # Desarrollo con tsx watch
npm run build  # Build de producción
npm start       # Ejecutar build
```

### **Testing**
```bash
npm test        # Tests unitarios
npm run test:integration  # Tests de integración
```

---
