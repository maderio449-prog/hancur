#!/usr/bin/env bash
set -e

# install.sh - pasang hancur sebagai perintah global di Termux
PREFIX=${PREFIX:-/data/data/com.termux/files/usr}
BIN_DIR="$PREFIX/bin"
SCRIPT_NAME="hancur"
SCRIPT_FILE="hancur.js"

echo "🔧 Instalasi Hancur Tool..."

# cek apakah node terpasang, kalau nggak pasang otomatis (Termux)
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Node.js tidak ditemukan. Menginstal nodejs (pkg install nodejs)..."
  pkg update -y || true
  pkg install nodejs -y
fi

# cek file ada
if [ ! -f "$SCRIPT_FILE" ]; then
  echo "❌ Error: $SCRIPT_FILE tidak ditemukan di folder ini."
  echo "Pastikan kamu menjalankan install.sh dari folder yang berisi $SCRIPT_FILE"
  exit 1
fi

# buat backup kalau sudah ada
if [ -f "$BIN_DIR/$SCRIPT_NAME" ]; then
  echo "⚠️ $BIN_DIR/$SCRIPT_NAME sudah ada, membackup ke ${SCRIPT_NAME}.bak"
  mv -f "$BIN_DIR/$SCRIPT_NAME" "$BIN_DIR/${SCRIPT_NAME}.bak" || true
fi

# copy dan beri izin eksekusi
echo "📁 Menyalin $SCRIPT_FILE ke $BIN_DIR/$SCRIPT_NAME ..."
cp "$SCRIPT_FILE" "$BIN_DIR/$SCRIPT_NAME"
chmod +x "$BIN_DIR/$SCRIPT_NAME"

echo "✅ Instalasi selesai! Jalankan perintah: $SCRIPT_NAME"
