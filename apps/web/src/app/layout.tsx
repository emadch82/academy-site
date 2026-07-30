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
    default: 'آموزشگاه زبان ویرا',
    template: '%s | آموزشگاه زبان ویرا',
  },
  description: 'آموزشگاه زبان ویرا، مرکز تخصصی آموزش زبان انگلیسی در اصفهان - دوره‌های کودکان، نوجوانان، بزرگسالان، مکالمه و TTC',
  keywords: ['آموزشگاه زبان', 'زبان ویرا', 'آموزش زبان انگلیسی', 'اصفهان', 'دوره زبان', 'TTC', 'آیلتس', 'مکالمه زبان'],
  authors: [{ name: 'Vira Language Academy' }],
  creator: 'Vira Academy',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://viraacademyesf.ir',
    siteName: 'آموزشگاه زبان ویرا',
    title: 'آموزشگاه زبان ویرا | آموزش تخصصی زبان انگلیسی',
    description: 'آموزش تخصصی زبان انگلیسی از پایه تا پیشرفته با بهترین اساتید در اصفهان',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آموزشگاه زبان ویرا | آموزش تخصصی زبان انگلیسی',
    description: 'آموزش تخصصی زبان انگلیسی از پایه تا پیشرفته با بهترین اساتید در اصفهان',
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
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('unhandledrejection',function(e){if(e.reason&&String(e.reason).indexOf('save-page')>-1)e.stopImmediatePropagation()});window.addEventListener('error',function(e){if(e.message&&e.message.indexOf('save-page')>-1)e.stopImmediatePropagation()},true);`,
          }}
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
