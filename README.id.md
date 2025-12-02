# Hono Pusher Clone - Dokumentasi

Aplikasi real-time messaging (klon Pusher) yang dibangun menggunakan Hono dan MongoDB.

## Fitur

- **WebSocket Server**: Koneksi real-time menggunakan `@hono/node-ws`
- **Event Triggering**: Endpoint REST API untuk broadcast pesan ke semua klien
- **Integrasi MongoDB**: Koneksi database menggunakan Mongoose
- **Frontend Demo**: Halaman HTML sederhana untuk demonstrasi

## Prasyarat

- Node.js v20 atau lebih tinggi
- MongoDB (lokal atau remote)
- npm atau yarn

## Instalasi

1. Clone repository atau copy project ini
2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` dan konfigurasi MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/hono-pusher
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Catatan CORS:**
- `ALLOWED_ORIGINS`: Daftar origin yang diizinkan (pisahkan dengan koma)
- Gunakan `*` untuk mengizinkan semua origin (tidak disarankan untuk production)
- Contoh: `ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com`

## Menjalankan Aplikasi

### Development
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Production (Docker)
```bash
docker-compose up -d
```

## Penggunaan

### 1. Buka Frontend
Akses `http://localhost:3000` di browser Anda.

### 2. Koneksi WebSocket
Frontend akan otomatis terhubung ke WebSocket server di `/ws`.

### 3. Trigger Event
- Isi form dengan:
  - **Channel**: Nama channel (contoh: `my-channel`)
  - **Event**: Nama event (contoh: `my-event`)
  - **Data**: Data yang akan dikirim (contoh: `Hello World`)
- Klik tombol "Trigger Event"
- Pesan akan muncul di semua tab/klien yang terhubung

### 4. Testing dengan Multiple Tabs
Buka beberapa tab browser dengan URL yang sama untuk melihat real-time broadcasting.

## API Endpoints

### POST /trigger
Broadcast event ke semua klien yang terhubung.

**Request Body:**
```json
{
  "channel": "my-channel",
  "event": "my-event",
  "data": "Hello World"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event triggered"
}
```

### GET /ws
WebSocket endpoint untuk koneksi real-time.

## Deployment ke Coolify

### Langkah-langkah:

1. **Push ke Git Repository** (GitHub/GitLab)

2. **Buat Service Baru di Coolify**:
   - Pilih **+ New Resource**
   - Pilih **Git Repository**
   - Connect repository Anda

3. **Konfigurasi**:
   - **Build Pack**: Dockerfile
   - **Port**: 3000

4. **Environment Variables**:
   - `MONGO_URI`: Connection string MongoDB Anda
   - `PORT`: 3000

5. **Deploy**: Klik deploy dan tunggu hingga selesai

### Catatan Deployment:
- Coolify menggunakan Traefik yang mendukung WebSocket secara default
- Pastikan domain Anda sudah dikonfigurasi dengan benar
- Untuk database, Anda bisa menggunakan MongoDB service di Coolify atau external database

## Struktur Project

```
hono-pusher-clone/
├── src/
│   ├── index.ts          # Main server file
│   └── db.ts             # MongoDB connection
├── public/
│   └── index.html        # Frontend demo
├── test-connection.ts    # Test script
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── .env                  # Environment variables
```

## Testing

Jalankan test script untuk verifikasi koneksi WebSocket:

```bash
npx tsx test-connection.ts
```

Script ini akan:
1. Koneksi ke WebSocket server
2. Trigger event via API
3. Verifikasi bahwa event diterima

## Troubleshooting

### Port 3000 sudah digunakan
```bash
# Windows
netstat -ano | findstr :3000
powershell -Command "Stop-Process -Id <PID> -Force"

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection error
- Pastikan MongoDB sudah berjalan
- Cek `MONGO_URI` di file `.env`
- Untuk MongoDB Atlas, pastikan IP address sudah di-whitelist

### WebSocket tidak terhubung
- Cek console browser untuk error
- Pastikan server sudah berjalan
- Verifikasi port yang digunakan

## Teknologi yang Digunakan

- **Hono**: Web framework yang cepat dan ringan
- **MongoDB**: Database NoSQL
- **Mongoose**: ODM untuk MongoDB
- **@hono/node-ws**: WebSocket support untuk Hono
- **TypeScript**: Type-safe development
- **Docker**: Containerization

## Lisensi

ISC

## Kontribusi

Silakan buat pull request atau buka issue untuk perbaikan dan fitur baru.
