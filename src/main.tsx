import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mysten/dapp-kit/dist/index.css'
import './index.css'
import '@radix-ui/themes/styles.css'

import { getFullnodeUrl } from '@mysten/sui.js/client'
import {
    SuiClientProvider,
    WalletProvider,
    createNetworkConfig,
} from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Theme } from '@radix-ui/themes'
import App from './App.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard.tsx'
import { Buy } from './pages/Buy.tsx'
import { Register } from './pages/Register.tsx'
import { Listings, walletLoader } from './pages/Listings.tsx'

const queryClient = new QueryClient()

const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    devnet: { url: getFullnodeUrl('devnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
})

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/buy',
                element: <Buy />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/my-listings',
                children: [
                    {
                        path: ':walletAddress',
                        element: <Listings needLogin={false} />,
                        loader: walletLoader,
                    },
                ],
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Theme appearance='dark'>
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider
                    networks={networkConfig}
                    defaultNetwork='devnet'
                >
                    <WalletProvider autoConnect>
                        <RouterProvider router={router} />
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </Theme>
    </React.StrictMode>,
)
