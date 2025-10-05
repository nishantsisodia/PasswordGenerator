import '../styles/globals.css'
import Layout from '../components/Layout'

export const metadata = {
    title: 'PassVault',
}

export default function RootLayout({ children }) {
    // This file is a server component that composes the client Layout.
    return (
        <html lang="en">
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    )
}
