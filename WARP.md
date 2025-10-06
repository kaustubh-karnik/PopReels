# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A full-stack video player application built with Next.js 15, featuring user authentication and video upload/management capabilities powered by ImageKit.

**Tech Stack:**
- Next.js 15 (App Router with Turbopack)
- TypeScript
- MongoDB with Mongoose
- NextAuth.js v4 (JWT-based authentication)
- ImageKit (video/image CDN and upload)
- Tailwind CSS v4
- RetroUI (Retro/Neobrutalist UI component library)
- bcryptjs (password hashing)

## Development Commands

### Core Commands
```bash
# Start development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Development Server
The dev server runs on `http://localhost:3000` by default with Turbopack enabled for faster builds.

## Environment Variables

Required environment variables (create `.env.local`):

```
# MongoDB connection string
MONGODB_URI=mongodb://...

# NextAuth configuration
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# ImageKit credentials
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
NEXT_PUBLIC_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

## Architecture

### Authentication System

**Flow:** NextAuth.js with credentials provider → MongoDB user lookup → JWT sessions

- **Configuration:** `lib/auth.ts` - Centralized NextAuth configuration
  - Credentials provider with email/password
  - JWT strategy with 30-day expiration
  - Custom callbacks for token/session management
  - Custom sign-in page at `/login`

- **Middleware:** `middleware.ts` - Route protection using NextAuth middleware
  - Public routes: `/`, `/login`, `/register`, `/api/auth/*`, `/api/videos/*`
  - Protected routes require valid JWT token
  - Applies to all routes except static assets

- **User Model:** `models/User.ts`
  - Pre-save hook automatically hashes passwords with bcryptjs (salt rounds: 10)
  - Timestamps enabled for createdAt/updatedAt

### Database Layer

**Pattern:** Singleton connection with global caching

- **Connection Manager:** `lib/db.ts`
  - Uses global cache to prevent multiple connections in development hot reload
  - Returns existing connection if available
  - Thread-safe promise-based initialization
  - Throws error if `MONGODB_URI` not set

- **Type Extension:** `types.d.ts` extends global namespace for mongoose cache typing

### Models

**User Model** (`models/User.ts`):
- Fields: `email` (unique), `password` (hashed), `createdAt`, `updatedAt`
- Password auto-hashing on save

**Video Model** (`models/Video.ts`):
- Fields: `title`, `description`, `videoUrl`, `thumbnailUrl`, `controls`, `transformation`
- Default dimensions: 1080x1920 (portrait/mobile-first)
- Transformation options: height, width, quality (1-100)
- Timestamps enabled

### API Routes

**Authentication:**
- `POST /api/auth/register` - User registration (creates new user in MongoDB)
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers (login, logout, session)
- `GET /api/auth/imagekit-auth` - Returns ImageKit upload authentication params

**Videos:**
- `GET /api/video` - Fetch all videos (sorted by newest first, no auth required)
- `POST /api/video` - Create video (requires authentication via JWT)
  - Validates required fields: title, description, videoUrl, thumbnailUrl
  - Sets default transformation quality to 100

### File Upload System

**Flow:** Client → ImageKit auth endpoint → ImageKit CDN → Success callback

- **Component:** `app/components/FileUpload.tsx`
  - Supports both image and video uploads
  - File validation (type checking, 100MB limit)
  - Progress tracking callback
  - Fetches auth params from `/api/auth/imagekit-auth` before upload
  - Uses `@imagekit/next` SDK for client-side uploads

- **Auth Endpoint:** `/api/auth/imagekit-auth`
  - Generates server-side authentication params (signature, token, expire)
  - Never exposes private key to client

### Context Providers

**Root Layout Providers** (`app/components/Providers.tsx`):
- `SessionProvider` - NextAuth session context (5-minute refetch interval)
- `ImageKitProvider` - ImageKit context with URL endpoint

These wrap all pages in `app/layout.tsx`.

## Path Aliases

TypeScript path mapping configured in `tsconfig.json`:
- `@/*` maps to root directory (e.g., `@/lib/auth`, `@/models/User`)

## Key Patterns

### Authentication Check Pattern
```typescript
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Database Connection Pattern
```typescript
await connectToDatabase(); // Call before any Mongoose operations
const data = await Model.find({}).lean(); // Use .lean() for read-only operations
```

### Mongoose Model Pattern
```typescript
// Prevents model recompilation in dev mode
const Model = models.ModelName || model<IModelName>("ModelName", schema);
```

## UI Components

**RetroUI Integration:**
- UI library: RetroUI (https://www.retroui.dev)
- Style: Retro/Neobrutalist design system
- Installation method: shadcn CLI with RetroUI registry
- Component path: `components/retroui/`

### Adding New RetroUI Components
```bash
# Install a component from RetroUI
npx shadcn@latest add https://retroui.dev/r/[component-name].json

# Example: Install button
npx shadcn@latest add https://retroui.dev/r/button.json
```

### Theme & Fonts
- **Heading font:** Archivo Black (`--font-head`)
- **Body font:** Space Grotesk (`--font-sans`)
- **Theme colors:** Yellow primary (#ffdb33), Black borders, Neobrutalist shadows
- **Design system:** Components use class-variance-authority for variants
- **Shadows:** Custom shadow utilities (shadow-xs to shadow-2xl) for neobrutalist effect

## Notes

- Uses Next.js App Router (not Pages Router)
- All API routes follow Route Handler pattern (`route.ts`)
- Mongoose models use conditional compilation to prevent hot-reload issues
- Password hashing is automatic via Mongoose pre-save hooks
- Video dimensions are portrait-oriented (1080x1920) by default
- All protected routes checked by middleware, not individual route guards
- UI uses RetroUI components with retro/neobrutalist styling

