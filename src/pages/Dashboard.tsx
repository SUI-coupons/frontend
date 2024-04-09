import { Flex } from '@radix-ui/themes'
import { Card } from '../components/Card'
import { useEffect, useState } from 'react'
import { useSuiClientQuery } from '@mysten/dapp-kit'

function CouponData({ coupon_id }: { coupon_id: string }) {
    const { data } = useSuiClientQuery('getObject', {
        id: coupon_id,
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

    if (data) {
        const { id, brand, itemDiscount, discount, expirationDate, publisher } =
            data.data.content.fields
        return (
            <Card
                description={`${itemDiscount}`}
                brand={`${brand}`}
                status={expirationDate.toString()}
                discount={(discount / 200).toString()}
            />
        )
    }
}

export function Dashboard() {
    const [listAvailableCoupons, setListAvailableCoupons] = useState([])

    const { data } = useSuiClientQuery('getObject', {
        id: import.meta.env.VITE_STATE_OBJECT_ID,
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

    useEffect(() => {
        if (data) {
            const listCoupons = data?.data?.content?.fields?.availableCoupons
            setListAvailableCoupons(listCoupons)
        }
    }, [data])

    return (
        listAvailableCoupons && (
            <div className='grid grid-cols-4 gap-x-8 gap-y-4 justify-between'>
                {listAvailableCoupons.map(
                    (coupon_id: string, index: number) => (
                        <CouponData coupon_id={coupon_id} key={index} />
                    ),
                )}
            </div>
        )
    )
}
