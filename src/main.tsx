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
import { Listings, walletLoader } from './pages/MyCoupons.tsx'
import { AddCoupon } from './pages/AddCoupon.tsx'
import SingleKiosk from './routes/SingleKiosk.tsx'
import { KisokClientProvider } from './context/KioskClientContext.tsx'
import Home from './routes/Home.tsx'
import { CouponDetail } from './pages/CouponDetail.tsx'
import { KioskCreation } from './components/Kiosk/KioskCreation.tsx'

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
                path: '/coupons',
                children: [
                    {
                        path: ':couponId',
                        element: <CouponDetail />,
                    },
                ],
            },
            {
                path: '/my-coupons',
                children: [
                    {
                        path: ':walletAddress',
                        element: <Listings needLogin={false} />,
                        loader: walletLoader,
                    },
                ],
            },
            {
                path: '/add',
                element: <AddCoupon />,
            },
            {
                path: '/kiosk',
                element: <Home />,
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
                    defaultNetwork='testnet'
                >
                    <WalletProvider autoConnect>
                        <KisokClientProvider>
                            <RouterProvider router={router} />
                        </KisokClientProvider>
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </Theme>
    </React.StrictMode>,
)
