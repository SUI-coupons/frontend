import { useLoaderData } from 'react-router-dom'
import { Card } from '../components/Card'
import {
    useSuiClientQuery,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { useEffect, useState } from 'react'
import { CouponData } from './Dashboard'

export function walletLoader({ params }) {
    const walletAddress = params.walletAddress
    return { walletAddress }
}

export function Listings({ needLogin }) {
    const walletAddress = needLogin ? '' : useLoaderData().walletAddress

    const [listAvailableCoupons, setListAvailableCoupons] = useState<
        (string | undefined)[]
    >([])

    const { data, refetch } = useSuiClientQuery('getOwnedObjects', {
        owner: walletAddress,
        filter: {
            MatchAll: [
                {
                    StructType: `${import.meta.env.VITE_PACKAGE_ID}::coupons::Coupon`,
                },
                {
                    AddressOwner: walletAddress,
                },
            ],
        },
    })

    useEffect(() => {
        if (data) {
            const listCoupons = data.data
            const mappedCoupons = listCoupons.map(coupon => {
                return coupon?.data.objectId
            })
            console.log(mappedCoupons)
            setListAvailableCoupons(mappedCoupons)
        }
    }, [data])

    return (
        <>
            {needLogin ? (
                <h1>Please login first</h1>
            ) : (
                <>
                    <h1>Wallet: {walletAddress}</h1>
                    <section className='grid grid-cols-4 gap-x-8 gap-y-4 justify-between'>
                        {listAvailableCoupons.map(
                            (coupon_id: string, index: number) => {
                                const CouponDataComponent = (
                                    <CouponData
                                        key={index}
                                        coupon_id={coupon_id}
                                    />
                                )
                                return CouponDataComponent
                            },
                        )}
                    </section>
                </>
            )}
        </>
    )
}
