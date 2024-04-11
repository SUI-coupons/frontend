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
    return (
        <div className='container'>
            <Tab.Group vertical defaultIndex={0}>
                <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1'>
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
                <Tab.Panels className=''>
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
