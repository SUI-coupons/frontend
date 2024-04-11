// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { KioskListing } from '@mysten/kiosk'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { KioskFnType, useOwnedKiosk } from '../../hooks/kiosk'
import {
    useCreateKioskMutation,
    useDelistMutation,
    usePurchaseItemMutation,
    useTakeMutation,
} from '../../mutations/kiosk'
import { TANSTACK_OWNED_KIOSK_KEY } from '../../utils/constants'
import { Button } from '../Base/Button'
import { DisplayObject } from '../DisplayObject'
import { OwnedObjectType } from '../Inventory/OwnedObjects'
import { TransactionBlock, Transactions } from '@mysten/sui.js/transactions'
import { findActiveCap } from '../../utils/utils'
import {
    useAccounts,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'

export type KioskItemProps = {
    isGuest?: boolean
    listing?: KioskListing | null
    kioskId: string
    hasKiosk: boolean
    onSuccess: () => void // parent component onSuccess handler.
    listFn: KioskFnType
    item: OwnedObjectType
}

export function KioskItem({
    item,
    kioskId,
    listing = null,
    isGuest = false,
    hasKiosk = false,
    onSuccess,
    listFn,
}: KioskItemProps) {
    const queryClient = useQueryClient()
    const createKiosk = useCreateKioskMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [TANSTACK_OWNED_KIOSK_KEY],
            })
            toast.success('Kiosk created successfully')
        },
    })

    const takeMutation = useTakeMutation({
        onSuccess: () => {
            toast.success('Item was transferred back to the address.')
            onSuccess()
        },
    })

    const delistMutation = useDelistMutation({
        onSuccess: () => {
            toast.success('Item delisted successfully')
            onSuccess()
        },
    })

    const currentAccount = useCurrentAccount()
    const { data: ownedKiosk } = useOwnedKiosk(currentAccount?.address)

    const purchaseMutation = usePurchaseItemMutation({
        onSuccess: () => {
            toast.success('Item purchased successfully')
            onSuccess()
        },
    })

    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransactionBlock()

    const handleDelist = () => {
        const txb = new TransactionBlock()
        const cap = findActiveCap(ownedKiosk?.caps, kioskId)

        if (!cap || !currentAccount?.address)
            throw new Error('Missing account, kiosk or kiosk cap')

        if (!item?.objectId) throw new Error('Missing item.')

        txb.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::delist_and_take_coupon`,
            arguments: [
                txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
                txb.object(kioskId),
                txb.object(cap.objectId),
                txb.pure.id(item.objectId),
            ],
        })

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

    if (isGuest)
        return (
            <DisplayObject item={item} listing={listing}>
                <>
                    {listing && hasKiosk && (
                        <Button
                            loading={purchaseMutation.isPending}
                            className='border-gray-400 bg-transparent hover:bg-primary hover:text-white md:col-span-2'
                            onClick={() =>
                                purchaseMutation.mutate({
                                    item: {
                                        ...item,
                                        listing,
                                    },
                                    kioskId: kioskId,
                                })
                            }
                        >
                            Purchase
                        </Button>
                    )}
                    {listing && !hasKiosk && (
                        <div className='md:col-span-2 text-xs'>
                            <p>Create a kiosk to interact with other kiosks.</p>

                            <Button
                                className='mt-2'
                                loading={createKiosk.isPending}
                                onClick={() => createKiosk.mutate()}
                            >
                                Click here to create.
                            </Button>
                        </div>
                    )}
                </>
            </DisplayObject>
        )

    return (
        <div className=''>
            <DisplayObject item={item} listing={listing}>
                <>
                    {!listing && !isGuest && (
                        <>
                            <Button
                                className='border-gray-400 bg-white hover:bg-primary hover:text-white '
                                loading={takeMutation.isPending}
                                disabled={item.isLocked}
                                onClick={() =>
                                    takeMutation.mutate({
                                        item,
                                        kioskId: kioskId,
                                    })
                                }
                            >
                                Take from Kiosk
                            </Button>

                            <Button
                                className='border-gray-400 bg-white hover:bg-primary hover:text-white'
                                onClick={() => listFn(item)}
                            >
                                List for Sale
                            </Button>
                        </>
                    )}
                    {listing && !isGuest && (
                        <Button
                            loading={delistMutation.isPending}
                            className='border-gray-400 bg-white hover:bg-primary hover:text-white md:col-span-2'
                            onClick={handleDelist}
                        >
                            Delist item
                        </Button>
                    )}
                </>
            </DisplayObject>
            <DisplayObject item={item} listing={listing}>
                <>
                    {!listing && !isGuest && (
                        <>
                            <Button
                                className='border-gray-400 bg-white hover:bg-primary hover:text-white '
                                loading={takeMutation.isPending}
                                disabled={item.isLocked}
                                onClick={() =>
                                    takeMutation.mutate({
                                        item,
                                        kioskId: kioskId,
                                    })
                                }
                            >
                                Take from Kiosk
                            </Button>

                            <Button
                                className='border-gray-400 bg-white hover:bg-primary hover:text-white'
                                onClick={() => listFn(item)}
                            >
                                List for Sale
                            </Button>
                        </>
                    )}
                    {listing && !isGuest && (
                        <Button
                            loading={delistMutation.isPending}
                            className='border-gray-400 bg-white hover:bg-primary hover:text-white md:col-span-2'
                            onClick={handleDelist}
                        >
                            Delist item
                        </Button>
                    )}
                </>
            </DisplayObject>
            <DisplayObject item={item} listing={listing}>
                <>
                    {!listing && !isGuest && (
                        <>
                            <Button
                                className='border-gray-400 bg-white hover:bg-primary hover:text-white '
                                loading={takeMutation.isPending}
                                disabled={item.isLocked}
                                onClick={() =>
                                    takeMutation.mutate({
                                        item,
                                        kioskId: kioskId,
                                    })
                                }
                            >
                                Take from Kiosk
                            </Button>

                            <Button
                                className='border-gray-400 bg-white hover:bg-primary hover:text-white'
                                onClick={() => listFn(item)}
                            >
                                List for Sale
                            </Button>
                        </>
                    )}
                    {listing && !isGuest && (
                        <Button
                            loading={delistMutation.isPending}
                            className='border-gray-400 bg-white hover:bg-primary hover:text-white md:col-span-2'
                            onClick={handleDelist}
                        >
                            Delist item
                        </Button>
                    )}
                </>
            </DisplayObject>
        </div>
    )
}
