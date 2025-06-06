import './globals.css'

export const metadata = {
  title: 'SkyVocab Trainer',
  description: 'A personal vocabulary training web app',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a1a] text-white">
        {children}
      </body>
    </html>
  )
}
