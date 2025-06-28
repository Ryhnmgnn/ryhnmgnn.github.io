# Online Shop with Cross-Device Account Access

This is an online shop application that allows users to access their accounts from any device (mobile phone, laptop, or PC).

## Features

- Cross-device account access
- User registration and login
- Profile management
- Shopping cart synchronization
- Responsive design for all devices

## Setup Instructions

1. Install Node.js on your computer if you haven't already
2. Clone this repository
3. Open a terminal in the project directory
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open `index.html` in your web browser

## How to Use

1. Register an account on any device
2. Log in using your credentials on any device
3. Your profile and shopping cart will be synchronized across all devices
4. Changes made on one device will be reflected on all other devices

## Technical Details

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Data Storage: In-memory (can be replaced with a database in production)
- Cross-device synchronization through REST API

## Security Notes

- In a production environment, you should:
  - Use HTTPS
  - Hash passwords
  - Implement proper session management
  - Use a real database
  - Add input validation
  - Implement rate limiting

# ShopNow - E-commerce Platform

## Fitur Utama

### Sistem Pembayaran Fleksibel

ShopNow sekarang mendukung sistem pembayaran yang lebih fleksibel di mana setiap produk dapat memiliki metode pembayaran yang berbeda dengan nomor rekening yang berbeda pula.

#### Fitur Sistem Pembayaran:

1. **Pembayaran Per Produk**: Setiap produk dapat memiliki metode pembayaran yang berbeda
2. **Nomor Rekening Berbeda**: Produk A dan B bisa menggunakan BCA dengan nomor rekening yang berbeda
3. **Informasi Pemilik Rekening**: Setiap metode pembayaran dapat menyimpan nama pemilik rekening
4. **Validasi Otomatis**: Sistem memastikan nomor rekening diisi jika metode pembayaran diaktifkan
5. **Pengelompokan Pembayaran**: Saat checkout, sistem mengelompokkan produk berdasarkan metode pembayaran

#### Cara Menggunakan:

**Di Admin Panel:**
1. Buka Admin Panel → Produk
2. Saat menambah/edit produk, pilih metode pembayaran yang diinginkan
3. Isi nomor rekening dan nama pemilik rekening untuk setiap bank
4. Sistem akan memvalidasi bahwa nomor rekening diisi jika metode pembayaran diaktifkan

**Di Pengaturan Toko:**
1. Buka Admin Panel → Pengaturan Toko
2. Atur metode pembayaran default yang akan digunakan sebagai template untuk produk baru
3. Setiap produk masih dapat memiliki pengaturan pembayaran yang berbeda

**Saat Checkout:**
1. User akan melihat opsi pembayaran yang tersedia berdasarkan produk yang dibeli
2. Setiap opsi pembayaran menampilkan bank, nomor rekening, nama pemilik, dan produk yang terkait
3. User dapat memilih metode pembayaran yang sesuai

#### Format Data Pembayaran:

```javascript
// Format baru (array)
payments: [
    {
        bank: "BCA",
        active: true,
        number: "1234567890",
        accountName: "John Doe"
    },
    {
        bank: "Mandiri", 
        active: false,
        number: "",
        accountName: ""
    }
]

// Format lama (object) - masih didukung untuk kompatibilitas
payments: {
    BCA: true,
    Mandiri: false,
    BNI: true
}
```

#### Keuntungan:

1. **Fleksibilitas**: Setiap produk dapat memiliki metode pembayaran yang berbeda
2. **Transparansi**: User dapat melihat nomor rekening dan nama pemilik rekening
3. **Validasi**: Sistem memastikan data pembayaran lengkap
4. **Kompatibilitas**: Mendukung format data lama dan baru
5. **Pengelompokan**: Memudahkan user memahami pembayaran untuk setiap produk

## Fitur Lainnya

- Manajemen produk dengan kategori dan stok
- Sistem keranjang belanja
- Sistem invoice dan pembayaran
- Manajemen user dan admin
- Sistem notifikasi
- Wishlist
- Review produk
- Upload bukti pembayaran
- Dan banyak lagi...

## Teknologi

- HTML5, CSS3, JavaScript
- LocalStorage untuk penyimpanan data
- Cloudinary untuk upload gambar
- Responsive design

## Instalasi

1. Clone repository ini
2. Buka `index.html` di browser
3. Untuk admin panel, buka `admin-login.html`
4. Login dengan kredensial admin default

## Kontribusi

Silakan berkontribusi dengan membuat pull request atau melaporkan bug melalui issues. 