// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Tab } from '@headlessui/react'
import {
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { formatAddress } from '@mysten/sui.js/utils'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { useKioskDetails, useOwnedKiosk } from '../../hooks/kiosk'
import { useWithdrawMutation } from '../../mutations/kiosk'
import { TANSTACK_KIOSK_DATA_KEY } from '../../utils/constants'
import { findActiveCap, formatSui, mistToSui } from '../../utils/utils'
import { Button } from '../Base/Button'
import { ExplorerLink } from '../Base/ExplorerLink'
import { Loading } from '../Base/Loading'
import { OwnedObjects } from '../Inventory/OwnedObjects'
import { KioskItems } from './KioskItems'
import clsx from 'clsx'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Marketplace } from './Marketplace'

export function KioskData({ kioskId }: { kioskId: string }) {
    const currentAccount = useCurrentAccount()

    const { data: kiosk, isPending } = useKioskDetails(kioskId)

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

    if (isPending) return <Loading />
    return (
        <div className='container'>
            <div className='my-12 '>
                {kiosk && (
                    <div className='gap-5 items-center'>
                        <div>
                            Selected Kiosk:{' '}
                            {
                                <ExplorerLink
                                    text={formatAddress(kiosk.id)}
                                    object={kiosk.id}
                                />
                            }
                        </div>
                        <div className='mt-2'>
                            Owner (displayed): (
                            <ExplorerLink
                                text={formatAddress(kiosk.owner)}
                                address={kiosk.owner}
                            />
                            )
                        </div>
                        <div className='mt-2'>
                            Items Count: {kiosk.itemCount}
                        </div>
                        <div className='mt-2'>
                            Profits: {profits} SUI
                            {
                                <Button
                                    loading={withdrawMutation.isPending}
                                    className=' ease-in-out duration-300 rounded border border-transparent px-4 bg-white-200 text-xs !py-1 ml-3'
                                    onClick={() =>
                                        withdrawMutation.mutate(kiosk)
                                    }
                                >
                                    Withdraw all
                                </Button>
                            }
                            {
                                <Button
                                    loading={withdrawMutation.isPending}
                                    className=' ease-in-out duration-300 rounded border border-transparent px-4 bg-white-200 text-xs !py-1 ml-3'
                                    onClick={handleClose}
                                >
                                    Close and withdraw
                                </Button>
                            }
                        </div>
                        <div className='mt-2'>
                            UID Exposed: {kiosk.allowExtensions.toString()}{' '}
                        </div>
                    </div>
                )}
            </div>

            <Tab.Group vertical defaultIndex={0}>
                <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1 w-[50%]'>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                            )
                        }
                    >
                        My Kiosk
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                            )
                        }
                    >
                        Marketplace
                    </Tab>
                </Tab.List>
                <Tab.Panels className='w-[50%]'>
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl bg-black p-3',
                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        )}
                    >
                        {kioskId && <KioskItems kioskId={kioskId}></KioskItems>}
                    </Tab.Panel>
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl bg-black p-3',
                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        )}
                    >
                        {kioskId && (
                            <Marketplace kioskId={kioskId}></Marketplace>
                        )}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}
