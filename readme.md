# 📦 @ponchoceniceros/utils

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Utilidades que facilitan el desarrollo de aplicaciones full-stack, proporcionando herramientas para logging coloreado y manejo de respuestas de API.

## ✨ Características

- **Logging coloreado**: Clase `Log` con métodos semánticos y colores ANSI para una mejor experiencia en consola.
- **Respuestas de API**: Interfaz genérica `ApiResponse<T>` y type guard `isApiResponse` para validar respuestas de API.
- **TypeScript first**: Desarrollado en TypeScript con tipos estrictos.
- **Ligero y modular**: Solo incluye lo necesario, fácil de importar parcialmente.

## 🚀 Instalación

```bash
npm install @ponchoceniceros/utils
```

O usando Yarn:

```bash
yarn add @ponchoceniceros/utils
```

### Requisitos

- Node.js >= 16.0.0
- TypeScript >= 4.5.0

## 📖 Uso

### Importación

```typescript
// Importar todo
import * as utils from '@ponchoceniceros/utils';

// Importar selectivamente
import { Log, ApiResponse, isApiResponse } from '@ponchoceniceros/utils';

// Importar por defecto (solo Log)
import utils from '@ponchoceniceros/utils';
```

### Logging

La clase `Log` proporciona métodos estáticos para logging coloreado en consola.

```typescript
import { Log } from '@ponchoceniceros/utils';

// Métodos semánticos
Log.success('Operación completada exitosamente');
Log.error('Ocurrió un error');
Log.warn('Advertencia: algo podría salir mal');
Log.info('Información general');
Log.debug('Mensaje de debug');

// Banners
Log.banner('=== INICIO DEL PROCESO ===');
Log.bannerBlue('Información importante');
Log.bannerMagenta('Sección destacada');

// Personalizado
Log.custom('brightYellow', 'Mensaje en amarillo brillante');

// Control del logging
Log.disable(); // Desactiva todo el logging
Log.enable();  // Reactiva el logging

// Variable de entorno DEBUGG_MODE (por defecto true)
process.env.DEBUGG_MODE = 'false'; // Desactiva logging globalmente
```

### Respuestas de API

Usa la interfaz `ApiResponse<T>` para estandarizar respuestas de API.

```typescript
import { ApiResponse, isApiResponse } from '@ponchoceniceros/utils';

// Definir una respuesta
const response: ApiResponse<string> = {
  isOk: true,
  mssg: 'Usuario creado correctamente',
  data: 'user123',
  expired: false
};

// Usar el type guard
function handleApiResponse(obj: unknown) {
  if (isApiResponse<string>(obj)) {
    if (obj.isOk && obj.data) {
      console.log('Éxito:', obj.mssg, 'Datos:', obj.data);
    } else {
      console.log('Error:', obj.mssg);
    }
  } else {
    console.log('Respuesta inválida');
  }
}
```

## 📚 API Reference

### Clase Log

Métodos estáticos para logging coloreado.

#### Métodos principales

- `Log.ok(...msg)`: Verde
- `Log.success(...msg)`: Verde brillante
- `Log.error(...msg)`: Rojo brillante
- `Log.warn(...msg)`: Amarillo
- `Log.info(...msg)`: Cyan
- `Log.debug(...msg)`: Gris

#### Banners

- `Log.banner(...msg)`: Negrita
- `Log.bannerBlue(...msg)`: Azul brillante
- `Log.bannerMagenta(...msg)`: Magenta brillante
- `Log.bannerInverse(...msg)`: Invertido

#### Utilitarios

- `Log.custom(color: keyof typeof colors, ...msg)`: Logging personalizado con color específico
- `Log.enable()`: Activa el logging
- `Log.disable()`: Desactiva el logging

#### Colores disponibles

Los colores se definen en el objeto `colors` (no exportado directamente, pero usado internamente).

### Interfaz ApiResponse<T>

```typescript
interface ApiResponse<T> {
  isOk: boolean;
  mssg: string;
  data?: T;
  expired?: boolean;
}
```

### Función isApiResponse<T>

Type guard para validar objetos como `ApiResponse<T>`.

```typescript
function isApiResponse<T>(
  obj: unknown,
  validateData?: (data: unknown) => data is T
): obj is ApiResponse<T>
```

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm run build      # Compila TypeScript a JavaScript
npm run dev        # Compila en modo watch
npm run test       # Ejecuta build y verifica
npm run lint       # Ejecuta linting (actualmente placeholder)
npm run clean      # Limpia la carpeta dist
```

### Estructura del proyecto

```
src/
├── index.ts      # Punto de entrada y exports
├── log.ts        # Clase Log y colores ANSI
└── types.ts      # Tipos ApiResponse y type guards
```

## 🐛 Reportar Issues

Si encuentras bugs o tienes sugerencias, por favor abre un issue en [GitHub Issues](https://github.com/ponchoceniceros/utils/issues).
