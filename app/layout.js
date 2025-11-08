export const metadata = {
  title: 'Webhook Signature Verifier',
  description: 'A tool for debugging webhook signatures',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
