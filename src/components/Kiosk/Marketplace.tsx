// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { normalizeSuiAddress } from '@mysten/sui.js/utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

import { useKiosk, useOwnedKiosk } from '../../hooks/kiosk'
import { Loading } from '../Base/Loading'
import { OwnedObjectType } from '../Inventory/OwnedObjects'
import { ListPrice } from '../Modals/ListPrice'
import { KioskItem as KioskItemCmp } from './KioskItem'
import { KioskNotFound } from './KioskNotFound'
import { CouponData } from '../../pages/Dashboard'

export function Marketplace() {
    const location = useLocation()
    const isKioskPage = location.pathname.startsWith('/kiosk/')
    const currentAccount = useCurrentAccount()

    const { data: walletKiosk } = useOwnedKiosk(currentAccount?.address)

    // checks if this is an owned kiosk.
    // We are depending on currentAccount too, as this is what triggers the `getOwnedKioskCap()` function to change
    // using endsWith because we support it with both 0x prefix and without.
    // const isOwnedKiosk = () => {
    //     return walletKiosk?.caps?.find(
    //         x => kioskId && normalizeSuiAddress(x.kioskId).endsWith(kioskId),
    //     )
    // }

    const [modalItem, setModalItem] = useState<OwnedObjectType | null>(null)

    const { data } = useSuiClientQuery('getObject', {
        id: `${import.meta.env.VITE_STATE_OBJECT_ID}`,
        options: {
            showType: true,
            showOwner: true,
            showPreviousTransaction: true,
            showDisplay: false,
            showContent: true,
            showBcs: false,
            showStorageRebate: true,
        },
    })

    const navigate = useNavigate()
    let listedCoupons: any[] = []

    if (data) {
        listedCoupons = data?.data?.content?.fields.listedCoupons
    }

    return (
        <div className='grid grid-cols-4 gap-x-8 gap-y-4 justify-between'>
            {listedCoupons.map((coupon: any) => {
                return <CouponData coupon_id={coupon} />
            })}
        </div>
    )
}
