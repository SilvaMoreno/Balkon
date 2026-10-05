'use client';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>StockControl</title>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 touch-manipulation">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
