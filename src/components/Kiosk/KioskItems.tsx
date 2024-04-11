// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { normalizeSuiAddress } from '@mysten/sui.js/utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

import { useKiosk, useKioskDetails, useOwnedKiosk } from '../../hooks/kiosk'
import { Loading } from '../Base/Loading'
import { OwnedObjectType } from '../Inventory/OwnedObjects'
import { ListPrice } from '../Modals/ListPrice'
import { KioskItem as KioskItemCmp } from './KioskItem'
import { KioskNotFound } from './KioskNotFound'
import { useQueryClient } from '@tanstack/react-query'
import { useWithdrawMutation } from '../../mutations/kiosk'
import { TANSTACK_KIOSK_DATA_KEY } from '../../utils/constants'
import { findActiveCap, formatSui, mistToSui } from '../../utils/utils'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Button } from '../Base/Button'

export function KioskItems({ kioskId }: { kioskId?: string }) {
    const location = useLocation()
    const isKioskPage = location.pathname.startsWith('/kiosk/')
    const currentAccount = useCurrentAccount()

    const { data: walletKiosk } = useOwnedKiosk(currentAccount?.address)

    // checks if this is an owned kiosk.
    // We are depending on currentAccount too, as this is what triggers the `getOwnedKioskCap()` function to change
    // using endsWith because we support it with both 0x prefix and without.
    const isOwnedKiosk = () => {
        return walletKiosk?.caps?.find(
            x => kioskId && normalizeSuiAddress(x.kioskId).endsWith(kioskId),
        )
    }

    const [modalItem, setModalItem] = useState<OwnedObjectType | null>(null)

    const {
        data: kioskData,
        isPending,
        isError,
        refetch: getKioskData,
    } = useKiosk(kioskId)

    const navigate = useNavigate()

    useEffect(() => {
        if (!isError) return
        toast.error(
            'The requested kiosk was not found. You either supplied a wrong kiosk Id or the RPC call failed.',
        )
    }, [navigate, isError])

    const { data: kiosk } = useKioskDetails(kioskId)

    const queryClient = useQueryClient()

    const withdrawMutation = useWithdrawMutation({
        onSuccess: () => {
            toast.success('Profits withdrawn successfully')
            // invalidate query to refetch kiosk data and update the balance.
            queryClient.invalidateQueries({
                queryKey: [TANSTACK_KIOSK_DATA_KEY, kioskId],
            })
        },
    })

    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransactionBlock()

    const { data: ownedKiosk } = useOwnedKiosk(currentAccount?.address)

    const kioskItems = kioskData?.items || []
    const kioskListings = kioskData?.listings || {}

    if (!kioskId)
        return <div className='py-12'>Supply a kiosk ID to continue.</div>

    if (isError && isKioskPage) return <KioskNotFound />

    if (isPending) return <Loading />

    // if (!kioskId || kioskItems.length === 0)
    //     return <div className='py-12'>The kiosk you are viewing is empty!</div>

    const handleClose = () => {
        console.log('close')
        if (!kiosk) return
        const cap = findActiveCap(ownedKiosk?.caps, kioskId)

        if (!cap || !currentAccount?.address)
            throw new Error('Missing account, kiosk or kiosk cap')

        const txb = new TransactionBlock()
        const [coin] = txb.moveCall({
            target: `0x2::kiosk::close_and_withdraw`,
            arguments: [txb.object('0x' + kiosk.id), txb.object(cap.objectId)],
        })
        txb.transferObjects([coin], currentAccount?.address)

        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui::testnet',
            },
            {
                onSuccess: result => {
                    console.log('result', result)
                },
            },
        )
    }

    const profits = formatSui(mistToSui(kiosk?.profits))

    return (
        <div className=''>
            {
                // We're hiding this when we've clicked "view kiosk" for our own kiosk.
                isOwnedKiosk() && isKioskPage && (
                    <div className='bg-yellow-300 text-black rounded px-3 py-2 mb-6'>
                        You're viewing your own kiosk
                    </div>
                )
            }
            {kioskItems.map((item: OwnedObjectType) => (
                <KioskItemCmp
                    key={item.objectId}
                    kioskId={kioskId}
                    item={item}
                    isGuest={!isOwnedKiosk()}
                    hasKiosk={!!walletKiosk?.kioskId}
                    onSuccess={() => {
                        getKioskData()
                    }}
                    listing={kioskListings && kioskListings[item.objectId]}
                    listFn={(item: OwnedObjectType) => setModalItem(item)}
                />
            ))}
            {modalItem && (
                <ListPrice
                    kioskId={kioskId}
                    item={modalItem}
                    onSuccess={() => {
                        toast.success('Item listed successfully.')
                        getKioskData() // replace with single kiosk Item search here and replace
                        setModalItem(null) // replace modal.
                    }}
                    closeModal={() => setModalItem(null)}
                />
            )}
            {kiosk && (
                <div className='gap-5 flex justify-between items-center'>
                    <div className='mt-2'>Items Count: {kiosk.itemCount}</div>
                    <div className='mt-2'>
                        Profits: {profits} SUI
                        {
                            <Button
                                loading={withdrawMutation.isPending}
                                className='ease-in-out duration-300 rounded px-4 text-md !py-1 ml-3'
                                onClick={() => withdrawMutation.mutate(kiosk)}
                            >
                                Withdraw all
                            </Button>
                        }
                        {
                            <Button
                                loading={withdrawMutation.isPending}
                                className='ease-in-out duration-300 rounded px-4 text-md !py-1 ml-3'
                                onClick={handleClose}
                            >
                                Close and withdraw
                            </Button>
                        }
                    </div>
                </div>
            )}
        </div>
    )
}
