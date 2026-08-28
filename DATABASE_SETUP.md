# Setup Database — EIC8 Check Sheet (Clone)

Panduan membuat database baru untuk hasil clone sistem ini, **memakai akun
Firebase Anda sendiri** dengan project yang benar-benar baru.

Sistem ini tidak punya backend server. "Database"-nya = **Cloud Firestore**
(mode Native) di Firebase, plus **Google Drive** (lewat Apps Script) untuk
menyimpan file foto/PDF bukti. Firebase Authentication **tidak dipakai** —
login user disimpan sendiri di koleksi `dashboard_users`.

Yang sudah disiapkan di repo ini untuk Anda:

| File | Fungsi |
|---|---|
| `firebase-config.js` | Sudah dikosongkan dari kredensial asli — tinggal Anda isi (Langkah 3) |
| `firestore.rules` | Security rules siap deploy (Langkah 4) |
| `firestore.indexes.json` | Composite index yang dibutuhkan query app (Langkah 5) |
| `firebase.json` / `.firebaserc` | Konfigurasi Firebase CLI (`.firebaserc` perlu diisi project id) |
| `google-apps-script/drive-proxy.gs` | Script proxy Google Drive untuk storage file (Langkah 7) |

---

## Langkah 1 — Buat project Firebase baru

1. Buka <https://console.firebase.google.com> (login dengan akun Google Anda).
2. **Add project** → beri nama, mis. `eic8-checksheet`. Catat **Project ID**
   yang di-generate (mis. `eic8-checksheet-xxxxx`).
3. Google Analytics boleh dimatikan (tidak dipakai).

## Langkah 2 — Aktifkan Firestore Database

1. Menu kiri: **Build → Firestore Database → Create database**.
2. Pilih lokasi (mis. `asia-southeast2` (Jakarta) atau `asia-southeast1`).
   **Lokasi tidak bisa diubah setelah dibuat.**
3. Mulai di **Production mode** (rules aman default). Kita ganti rules-nya di
   Langkah 4.

## Langkah 3 — Daftarkan Web App & isi `firebase-config.js`

1. Di Firebase Console: ikon **⚙️ (Project settings) → General**.
2. Scroll ke **Your apps** → klik ikon **Web `</>`**.
3. Beri nickname (mis. `eic8-web`), **jangan** centang Firebase Hosting dulu,
   **Register app**.
4. Salin object `firebaseConfig` yang muncul.
5. Buka `firebase-config.js` di repo, ganti nilai placeholder dengan milik Anda:

```js
const firebaseConfig = {
  apiKey: "AIza...",                       // punya Anda
  authDomain: "eic8-checksheet-xxxxx.firebaseapp.com",
  projectId: "eic8-checksheet-xxxxx",
  storageBucket: "eic8-checksheet-xxxxx.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

> API key Firebase Web **memang public** (ikut ter-deploy ke browser). Itu
> normal — keamanan data diatur oleh Security Rules, bukan oleh menyembunyikan
> key. Model kepercayaan sistem ini: rules terbuka penuh, jadi jangan taruh
> data rahasia di dalamnya.

## Langkah 4 — Pasang Security Rules

Isi `firestore.rules` sudah cocok dengan sistem ini (semua koleksi terbuka
`allow read, write: if true`, karena app tidak punya auth per-request).

**Cara A — lewat Console (paling cepat):**
Firestore Database → tab **Rules** → hapus isinya → paste seluruh isi
`firestore.rules` → **Publish**.

**Cara B — lewat Firebase CLI:** lihat Langkah 8.

> Kalau nanti Anda menambah fitur yang menulis ke koleksi **baru**, tambahkan
> blok `match /nama_koleksi/{doc} { allow read, write: if true; }` — koleksi
> tanpa blok `match` **ditolak** secara default, bukan diizinkan.

## Langkah 5 — Buat Composite Index

Beberapa query app memakai `where(...)` + `orderBy('createdAt','desc')` pada
field berbeda → Firestore butuh **composite index**. Query yang butuh:

| Koleksi | Query | Dipakai di |
|---|---|---|
| `checksheets` | `assetTag ==` + `createdAt desc` | tiap check sheet ("load submission terakhir"), `dashboard.html` |
| `checksheets` | `overallStatus ==` + `createdAt desc` | filter status di `dashboard.html` |
| `approvals` | `checksheetId ==` + `createdAt desc` | banner revisi, kolom status di `dashboard.html` |
| `approvals` | `status ==` + `createdAt desc` | filter inbox di `Review_Approval_Dashboard.html` |

**Cara A — otomatis (paling gampang):** jalankan saja app-nya, buka
`dashboard.html` / sebuah check sheet, lakukan aksi yang memicu query itu.
Query pertama yang gagal akan melempar error di Console browser (F12) berisi
**link langsung** "create this index" — klik, **Create**, tunggu ~1–3 menit
sampai status **Enabled**.

**Cara B — sekaligus lewat CLI:** `firebase deploy --only firestore:indexes`
(pakai `firestore.indexes.json` yang sudah disiapkan). Lihat Langkah 8.

## Langkah 6 — Buat user admin pertama

Login dashboard dibaca dari koleksi `dashboard_users` (password di-hash
SHA-256). Koleksi masih kosong, jadi belum ada yang bisa login. Buat user
pertama lewat halaman **`admin-users.html`** (halaman ini sengaja tanpa
proteksi supaya bisa dipakai bootstrap):

1. Serve folder repo secara lokal (lihat Langkah 9) lalu buka
   `http://localhost:8765/admin-users.html`.
2. Isi **Username**, **Password**, **Role** = `admin` → **Tambah User**.
3. Sekarang bisa login di `dashboard.html` dan
   `Review_Approval_Dashboard.html` dengan user itu.
4. **Setelah selesai bootstrap, sebaiknya batasi akses ke `admin-users.html`**
   (jangan di-deploy publik, atau hapus dari folder hosting) — siapa pun yang
   membukanya bisa membuat user admin.

Field dokumen `dashboard_users` yang dipakai app: `username`, `password`
(hash), `role` (`technician` | `techop2` | `supervisor` | `admin`), `name`,
`createdAt`, dan opsional `signature` (data URL PNG), `team` (`E7`/`C7`),
`area`. Registrasi mandiri dari `Review_Approval_Dashboard.html` mengisi
sisanya sendiri.

## Langkah 7 — (Opsional) Storage file: Google Drive proxy

Hanya perlu kalau Anda memakai fitur **foto bukti / PDF arsip** pada check
sheet dan alur Review & Approval. Firebase Storage **tidak dipakai** (butuh
paket berbayar Blaze hanya untuk mengaktifkannya) — file diarahkan ke Google
Drive lewat Apps Script.

1. Di Google Drive (akun Anda), buat folder mis. `EIC8 Check Sheet Files`.
   Buka folder itu, salin **folder id** dari URL
   (`drive.google.com/drive/folders/<ID INI>`).
2. Klik kanan folder → **Share → General access → "Anyone with the link" →
   Viewer**. Lakukan **manual lewat UI Drive**, sekali — jangan lewat kode.
3. Buka <https://script.google.com> → **New project**.
4. Hapus isi `Code.gs`, paste seluruh isi
   `google-apps-script/drive-proxy.gs`.
5. Ganti `ROOT_FOLDER_ID` dengan folder id dari langkah 1.
6. **Deploy → New deployment → Web app**: *Execute as* = **Me**,
   *Who has access* = **Anyone**. Authorize saat diminta.
7. Salin **Web App URL** (berakhiran `/exec`) → tempel ke `DRIVE_PROXY_URL`
   di baris atas `storage-helper.js`.
8. Setiap kali mengedit script `.gs` nanti: **Deploy → Manage deployments →
   edit → New version**, kalau tidak, Web App tetap menjalankan kode lama.

Kalau `DRIVE_PROXY_URL` masih berisi `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE`,
setiap upload akan melempar error yang jelas (tidak diam-diam gagal).

## Langkah 8 — (Opsional) Deploy rules/index/hosting via Firebase CLI

```powershell
npm install -g firebase-tools
firebase login
# ganti "default" di .firebaserc dengan Project ID Anda, atau:
firebase use --add                     # pilih project Anda, beri alias "default"

firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only hosting          # opsional: hosting di *.web.app
```

`firebase.json` sudah dikonfigurasi: `public: "."` dengan `ignore` untuk file
config, `*.md`, dan `*.zip`. Sesuaikan bila perlu.

> Alternatif hosting: GitHub Pages (repo sudah punya `.nojekyll`). Cukup push
> ke `main` dan aktifkan Pages di setting repo GitHub.

## Langkah 9 — Tes lokal

```powershell
# dari folder repo
python -m http.server 8765
# lalu buka http://localhost:8765/index.html
```

Butuh koneksi internet walau lokal (SDK Firebase, jsPDF, dll. dimuat dari CDN).

**Checklist verifikasi:**

- [ ] Buka sebuah check sheet (mis. `PM_CheckSheet_BYC125.html`), isi, klik
      **Submit** → muncul notifikasi hijau "berhasil".
- [ ] Di Firebase Console → Firestore → muncul dokumen baru di koleksi
      `checksheets`.
- [ ] Buka `dashboard.html`, login dengan user admin (Langkah 6) → submission
      tadi tampil di tabel & statistik.
- [ ] Kalau ada error "The query requires an index" di Console browser → klik
      link-nya, Create, tunggu Enabled, reload (Langkah 5).
- [ ] (Jika pakai Langkah 7) Submit check sheet dengan foto → cek file muncul
      di folder Google Drive, dan foto bisa dibuka dari
      `Review_Approval_Dashboard.html`.

---

## Referensi: koleksi Firestore yang dipakai

| Koleksi | Isi | Ditulis oleh | Dibaca oleh |
|---|---|---|---|
| `checksheets` | 1 dok per submit check sheet (append-only) | tiap `*.html` check sheet via `DB.save()` (`db-helper.js`) | `dashboard.html`, tiap check sheet ("load terakhir"), `Review_Approval_Dashboard.html` |
| `approvals` | 1 dok per submission untuk alur review→approve (di-update in-place) | check sheet via `Approvals.submitWithFiles()` (`approval-helper.js`) | `Review_Approval_Dashboard.html`, `dashboard.html` |
| `dashboard_users` | akun login (username, hash password, role, name, signature, team, area) | `admin-users.html`, registrasi di `Review_Approval_Dashboard.html` | login `dashboard.html` / `Review_Approval_Dashboard.html` / widget `technician-auth.js` |
| `dashboard_config` | doc `registration` berisi field `code` (kode akses registrasi role tinggi) | dibuat manual admin (opsional) | `Review_Approval_Dashboard.html` (`getElevatedRegCode()`) — jika tidak ada, fallback ke konstanta `ELEVATED_REG_CODE` di file itu |
| `weekly_dashboard` | doc meta per dashboard (`eic7_weekly`, `eic7_jobarrangement`) + subcollection `workOrders` | `Weekly Report Dashboard EIC7.html` (tombol "Update ke Cloud") | `Weekly Report Dashboard EIC7 - View Only.html` |

## Referensi: apa yang TIDAK perlu

- **Firebase Authentication** — tidak dipakai sama sekali.
- **Firebase Storage** — sengaja dihindari (butuh Blaze). Pakai Drive proxy.
- **Cloud Functions / server** — tidak ada.
- **Paket Blaze** — seluruh sistem jalan di paket gratis **Spark**.
