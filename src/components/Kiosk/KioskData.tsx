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
                <Tab.List className='flex space-x-1 rounded-xl rounded-b-none bg-blue-900/20'>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full rounded-lg rounded-r-none rounded-bl-none py-2.5 text-sm font-medium leading-5',
                                selected
                                    ? 'bg-[#141619] text-[#4DA2FF] shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                            )
                        }
                    >
                        My Kiosk
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            clsx(
                                'w-full rounded-lg rounded-l-none rounded-br-none py-2.5 text-sm font-medium leading-5',
                                selected
                                    ? 'bg-[#141619] text-[#4DA2FF] shadow'
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
                            'rounded-xl rounded-t-none bg-[#141619] p-3',
                        )}
                    >
                        {kioskId && <KioskItems kioskId={kioskId}></KioskItems>}
                    </Tab.Panel>
                    <Tab.Panel
                        className={clsx(
                            'rounded-xl rounded-t-none bg-[#141619] p-3',
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
