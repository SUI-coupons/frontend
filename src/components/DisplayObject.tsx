// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { KioskListing } from '@mysten/kiosk'
import { ReactNode, useEffect } from 'react'

import { DEFAULT_IMAGE } from '../utils/constants'
import { formatSui, mistToSui } from '../utils/utils'
import { OwnedObjectType } from './Inventory/OwnedObjects'
import { ItemLockedBadge } from './Kiosk/ItemLockedBadge'
import { useOwnedObjects } from '../hooks/useOwnedObjects'
import { Loading } from './Base/Loading'
import { CouponData } from '../pages/Dashboard'

export interface DisplayObject {
    listing?: KioskListing | null
    item: OwnedObjectType
    children: ReactNode
}

export function DisplayObject({
    item,
    listing = null,
    children,
}: DisplayObject) {
    if (item) {
        return <CouponData coupon_id={item.objectId} price={listing?.price} />
    } else {
        return <Loading />
    }
}
