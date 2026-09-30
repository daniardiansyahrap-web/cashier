-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "gambar" TEXT;

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "stokAwal" INTEGER NOT NULL,
    "stokAkhir" INTEGER NOT NULL,
    "catatan" TEXT,
    "referensi" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "kasirId" TEXT NOT NULL,
    "shiftId" TEXT,
    "nomor" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "diskon" INTEGER NOT NULL DEFAULT 0,
    "pajak" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "metodeBayar" TEXT NOT NULL,
    "bayar" INTEGER NOT NULL,
    "kembalian" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionItem" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga" INTEGER NOT NULL,
    "diskon" INTEGER NOT NULL DEFAULT 0,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "kasirId" TEXT NOT NULL,
    "saldoAwal" INTEGER NOT NULL,
    "saldoSistem" INTEGER,
    "saldoAkhir" INTEGER,
    "selisih" INTEGER,
    "catatan" TEXT,
    "bukaAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutupAt" TIMESTAMP(3),

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_outletId_key" ON "Stock"("productId", "outletId");

-- CreateIndex
CREATE INDEX "StockMovement_productId_createdAt_idx" ON "StockMovement"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "StockMovement_outletId_createdAt_idx" ON "StockMovement"("outletId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_nomor_key" ON "Transaction"("nomor");

-- CreateIndex
CREATE INDEX "Transaction_tenantId_createdAt_idx" ON "Transaction"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_outletId_createdAt_idx" ON "Transaction"("outletId", "createdAt");

-- CreateIndex
CREATE INDEX "TransactionItem_transactionId_idx" ON "TransactionItem"("transactionId");

-- CreateIndex
CREATE INDEX "Shift_outletId_bukaAt_idx" ON "Shift"("outletId", "bukaAt");

-- CreateIndex
CREATE INDEX "Product_tenantId_barcode_idx" ON "Product"("tenantId", "barcode");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
