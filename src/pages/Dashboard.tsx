import { Flex } from '@radix-ui/themes'
import { Card } from '../components/Card'
import { useEffect, useState } from 'react'
import { useSuiClientQuery } from '@mysten/dapp-kit'

export function CouponData({
    coupon_id,
    claimable,
}: {
    coupon_id: string
    claimable: boolean
}) {
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
        if (!data?.data?.content?.fields?.id) {
            return null
        }
        const {
            id,
            brandName,
            itemDiscount,
            discount,
            expirationDate,
            publisher,
            imageURI,
        } = data?.data?.content?.fields
        return (
            <Card
                coupon_id={id.id.toString()}
                description={`${itemDiscount}`}
                brand={`${brandName}`}
                status={expirationDate.toString()}
                discount={(discount / 200).toString()}
                imageURI={imageURI}
                claimable={claimable}
            />
        )
    }
}

export function Dashboard() {
    const [listAvailableCoupons, setListAvailableCoupons] = useState([])

    const { data, refetch } = useSuiClientQuery('getObject', {
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
                    (coupon_id: string, index: number) => {
                        const CouponDataComponent = (
                            <CouponData
                                key={index}
                                coupon_id={coupon_id}
                                claimable={true}
                            />
                        )
                        return CouponDataComponent
                    },
                )}
            </div>
        )
    )
}
