// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
    useSuiClientQuery,
} from '@mysten/dapp-kit'
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
import clsx from 'clsx'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { findActiveCap } from '../../utils/utils'

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

    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransactionBlock()

    let listedCoupons: any[] = []

    const handlePurchase = (kioskId, objectId) => {
        console.log('kioskId', kioskId)
        console.log('objectId', objectId)
        const txb = new TransactionBlock()
        const [coin] = txb.splitCoins(txb.gas, [txb.pure(1000)])
        // console.log('coin', coin)
        txb.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::test`,
            arguments: [txb.object(kioskId), txb.object(objectId), coin],
        })
        txb.transferObjects(
            [coin],
            txb.pure.address(
                '0x5995add1b15418ef6e4c0be4656c6b26413ec64bfa86ac19c400b04c0fedb0ff',
            ),
        )
        // console.log(coupon)
        // console.log(trasnferRequest)
        // txb.transferObjects(coupon, currentAccount?.address)
        // txb.moveCall({
        //     target: `${import.meta.env.VITE_PACKAGE_ID}::rule::payFee`,
        //     arguments: [
        //         txb.object(`${import.meta.env.VITE_POLICY}`),
        //         trasnferRequest,
        //         coin,
        //     ],
        // })
        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui::testnet',
            },
            {
                onSuccess: result => {
                    console.log('result', result)
                },
                onError: error => {
                    console.log('error', error)
                },
            },
        )
    }

    if (data) {
        // @ts-ignore
        const listedCouponsAddress = data?.data?.content?.fields.listedCoupons
        // @ts-ignore
        const listedCouponsPrice = data?.data?.content?.fields.listedPrice
        // @ts-ignore
        const listedCouponsOwner = data?.data?.content?.fields.listedOwner
        // @ts-ignore
        const listedCouponsKiosk = data?.data?.content?.fields.listedKiosk
        const listedCoupons = listedCouponsAddress
            ?.filter(
                (address, index) =>
                    listedCouponsOwner &&
                    listedCouponsOwner[index] !== currentAccount?.address,
            )
            .map((address, index) => {
                const owner = listedCouponsOwner
                    ? listedCouponsOwner[index]
                    : undefined
                const price = listedCouponsPrice
                    ? listedCouponsPrice[index]
                    : undefined
                const kiosk = listedCouponsKiosk
                    ? listedCouponsKiosk[index]
                    : undefined
                return {
                    address,
                    price,
                    owner,
                    kiosk,
                }
            })

        return (
            <div className='grid grid-cols-4 gap-x-8 gap-y-4 justify-between'>
                {listedCoupons.map((coupon: any) => {
                    return (
                        <CouponData
                            coupon_id={coupon.address}
                            price={coupon.price}
                        >
                            <div>
                                <button
                                    className={clsx(
                                        `px-4 py-2 bg-[#4DA2FF] rounded-md`,
                                    )}
                                    onClick={e => {
                                        e.preventDefault()
                                        handlePurchase(
                                            coupon.kiosk,
                                            coupon.address,
                                        )
                                    }}
                                >
                                    Purchase
                                </button>
                            </div>
                        </CouponData>
                    )
                })}
            </div>
        )
    } else {
        return <Loading />
    }
}
