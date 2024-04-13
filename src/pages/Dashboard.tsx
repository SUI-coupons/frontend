import { Flex } from '@radix-ui/themes'
import { Card } from '../components/Card'
import { useEffect, useState } from 'react'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { get } from 'react-hook-form'

export function CouponData({
    coupon_id,
    price,
    children,
}: {
    coupon_id: string
    price: string
    children?: React.ReactNode
}) {
    console.log('coupon_id', coupon_id)
    console.log('price', price)
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
        const {
            id,
            brandName,
            itemDiscount,
            discount,
            expirationDate,
            publisher,
            imageURI,
            // @ts-ignore
        } = data?.data?.content?.fields
        let ownerType = ''
        // @ts-ignore
        if (data?.data?.owner.AddressOwner) {
            ownerType = 'address'
            // @ts-ignore
        } else if (data?.data?.owner.ObjectOwner) {
            ownerType = 'object'
        } else {
            ownerType = 'shared'
        }
        return (
            <Card
                coupon_id={id.id.toString()}
                description={`${itemDiscount}`}
                brand={`${brandName}`}
                status={expirationDate.toString()}
                discount={(discount / 200).toString()}
                imageURI={imageURI}
                ownerType={ownerType}
                price={price}
                children={children}
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
            // @ts-ignore
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
                            // @ts-ignore
                            <CouponData key={index} coupon_id={coupon_id} />
                        )
                        return CouponDataComponent
                    },
                )}
            </div>
        )
    )
}
