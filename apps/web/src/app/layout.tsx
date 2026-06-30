import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';
import { CartProvider } from '@/contexts/cart-context';
import { DrawerProvider } from '@/contexts/drawer-context';
import { ReviewsProvider } from '@/contexts/reviews-context';
import { WalletProvider } from '@/contexts/wallet-context';
import { DiscountProvider } from '@/contexts/discount-context';
import { InvoiceProvider } from '@/contexts/invoice-context';
import { NotificationProvider } from '@/contexts/notification-context';
import { StoreProvider } from '@/contexts/store-context';
import { SiteLayout } from '@/components/site-layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'آموزشگاه نجوای قلم | مرکز تخصصی نخبه پروری',
    template: '%s | آموزشگاه نجوای قلم',
  },
  description: 'آموزشگاه نجوای قلم، مرکز تخصصی نخبه پروری در اصفهان - دوره‌های هوش مصنوعی، طراحی سایت، برنامه‌نویسی، زبان انگلیسی و بیشتر',
  keywords: ['آموزشگاه', 'نجوای قلم', 'نخبه پروری', 'اصفهان', 'هوش مصنوعی', 'طراحی سایت', 'برنامه‌نویسی', 'زبان انگلیسی', 'رباتیک'],
  authors: [{ name: 'Najva Ghalam Academy' }],
  creator: 'Najva Ghalam',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://najvaaca.ir',
    siteName: 'آموزشگاه نجوای قلم',
    title: 'آموزشگاه نجوای قلم | مرکز تخصصی نخبه پروری',
    description: 'مرکز تخصصی نخبه پروری در اصفهان - با لذت یاد بگیر، رشد کن و آینده‌ات رو رقم بزن',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آموزشگاه نجوای قلم | مرکز تخصصی نخبه پروری',
    description: 'مرکز تخصصی نخبه پروری در اصفهان - با لذت یاد بگیر، رشد کن و آینده‌ات رو رقم بزن',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <StoreProvider>
          <CartProvider>
            <DrawerProvider>
              <ReviewsProvider>
                <WalletProvider>
                  <DiscountProvider>
                    <InvoiceProvider>
                      <NotificationProvider>
                        <SiteLayout>
                          {children}
                        </SiteLayout>
                      </NotificationProvider>
                    </InvoiceProvider>
                  </DiscountProvider>
                </WalletProvider>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </ReviewsProvider>
            </DrawerProvider>
          </CartProvider>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
