#!/usr/bin/env bash
set -e
PREFIX=${PREFIX:-/data/data/com.termux/files/usr}
BIN_DIR="$PREFIX/bin"
SCRIPT_NAME="hancur"

if [ -f "$BIN_DIR/$SCRIPT_NAME" ]; then
  echo "🗑 Menghapus $BIN_DIR/$SCRIPT_NAME ..."
  rm -f "$BIN_DIR/$SCRIPT_NAME"
  # restore backup jika ada
  if [ -f "$BIN_DIR/${SCRIPT_NAME}.bak" ]; then
    echo "♻️ Mengembalikan backup ke $SCRIPT_NAME"
    mv "$BIN_DIR/${SCRIPT_NAME}.bak" "$BIN_DIR/$SCRIPT_NAME"
  fi
  echo "✅ Uninstall selesai."
else
  echo "⚠️ Tidak menemukan $BIN_DIR/$SCRIPT_NAME. Sudah ter-uninstall atau tidak terpasang."
fi
