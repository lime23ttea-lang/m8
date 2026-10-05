# VibeTube

Una plataforma de visualización de videos limpia, minimalista y sin distracciones.

## 🎯 Concepto

VibeTube es un "video viewer" que proporciona una experiencia de visualización controlada:
- **Sin distracciones**: No hay comentarios, recomendaciones invasivas ni publicidad
- **Filtrado de contenido**: Múltiples niveles de seguridad (General, Safe, Educational, Strict)
- **Modo Education**: Filtrado estricto para entornos educativos
- **Interfaz limpia**: Diseño moderno, dark mode, responsive

## ✨ Características (V1)

### Implementado
- ✅ Búsqueda de videos (requiere YouTube API)
- ✅ Detección automática de URLs de YouTube
- ✅ Reproductor limpio integrado
- ✅ Sistema de filtros de contenido
- ✅ Modo Education
- ✅ Historial de reproducción local
- ✅ Favoritos y Watch Later
- ✅ Sistema de reportes
- ✅ Blocklist local
- ✅ Selector de servidor (balanceo de carga)
- ✅ Diseño responsive (PC, tablet, móvil)

### Próximas versiones
- V2: Validación avanzada de URLs
- V3: SafeSearch mejorado
- V4: Blocklist + reportes avanzados
- V5: Cuentas de usuario + sincronización
- V6: Modo Education mejorado
- V7: Moderación avanzada
- V8: Panel de administración
- V9: Múltiples servidores + fallback
- V10: Extensión de navegador
- V11: PWA + móvil
- V12: Optimización avanzada

## 🚀 Instalación

### Requisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU_USUARIO/vibetube.git
cd vibetube
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
cp .env.example .env
```

Edita `.env` y agrega tu YouTube Data API v3 key:
```
VITE_YOUTUBE_API_KEY=tu_clave_aqui
```

**Nota**: Sin API key, la búsqueda por texto no funcionará, pero puedes seguir usando la plataforma pegando URLs de YouTube directamente.

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

5. **Build para producción**
```bash
npm run build
```

Los archivos optimizados estarán en `dist/`.

## 🔑 YouTube API Key (Opcional)

Para habilitar la búsqueda por texto:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **YouTube Data API v3**
4. Crea credenciales (API Key)
5. Copia la clave y pégala en `.env`

**Sin API key**: La plataforma funciona perfectamente pegando URLs de YouTube en el buscador.

## 📁 Estructura del Proyecto

```
vibetube/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Layout.tsx
│   │   ├── SearchBar.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── FilterSelector.tsx
│   │   └── ReportModal.tsx
│   ├── pages/           # Páginas principales
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── Watch.tsx
│   │   ├── History.tsx
│   │   ├── Favorites.tsx
│   │   ├── WatchLater.tsx
│   │   └── Settings.tsx
│   ├── services/        # Lógica de negocio
│   │   ├── youtube.ts   # API de YouTube
│   │   └── storage.ts   # LocalStorage
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades
│   │   └── urlParser.ts
│   ├── App.tsx          # Router principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globales
├── public/              # Assets estáticos
├── .env.example         # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

## 🎨 Tecnologías

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router DOM** - Routing
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🔒 Privacidad

- Los datos se almacenan localmente en el navegador (localStorage)
- No se recopilan datos personales innecesarios
- No se almacenan contraseñas en texto plano
- El usuario puede borrar su historial en cualquier momento

## 🛡️ Seguridad

- No se exponen claves privadas en el frontend
- Los permisos se validan en backend (versiones futuras)
- Sistema de filtrado de contenido configurable
- Blocklist para contenido inapropiado

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en GitHub.

---

**VibeTube** — Clean Video Experience
