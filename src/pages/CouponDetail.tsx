import {
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
    useSuiClientQuery,
} from '@mysten/dapp-kit'
import { Select } from '@radix-ui/themes'
import clsx from 'clsx'
import { Link, useParams } from 'react-router-dom'
import { Listbox, Transition } from '@headlessui/react'
import { useState, Fragment } from 'react'
import { useOwnedKiosk } from '../hooks/kiosk'
import { Loading } from '../components/Base/Loading'
import { WalletNotConnected } from '../components/Base/WalletNotConnected'
import { assert, formatAddress } from '@mysten/sui.js/utils'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { usePlaceMutation } from '../mutations/kiosk'
import { formatSui, suiToMist } from '../utils/utils'

export function CouponData({ coupon_id }: { coupon_id: string }) {
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
        console.log(data)
        if (data?.data?.owner?.ObjectOwner) return null
        return data?.data?.content?.fields
    }
}

export function CouponDetail() {
    const currentAccount = useCurrentAccount()

    const {
        data: ownedKiosk,
        isPending,
        refetch: refetchOwnedKiosk,
    } = useOwnedKiosk(currentAccount?.address)

    const { couponId } = useParams()
    const couponData = CouponData({ coupon_id: couponId! })
    const [selectedKiosk, setSelectedKiosk] = useState('')
    const [selectedPrice, setSelectedPrice] = useState(0)
    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransactionBlock()

    if (!currentAccount?.address) return <WalletNotConnected />
    if (isPending) return <Loading />
    if (!couponData)
        return (
            <h1>
                Already listed, checkout other vouchers or manage your kiosk
            </h1>
        )
    let kiosks = []
    if (ownedKiosk) {
        // console.log(ownedKiosk)
        kiosks = ownedKiosk.caps.map(cap => cap.kioskId)
    }

    const handleList = () => {
        if (!ownedKiosk) return
        console.log(selectedPrice)
        const trueMIST = suiToMist(selectedPrice)
        console.log(trueMIST)
        const txb = new TransactionBlock()
        const kioskId = selectedKiosk
        if (!kioskId) return
        const capId = ownedKiosk.caps.find(
            cap => cap.kioskId === kioskId,
        )?.objectId
        console.log(capId, kioskId, couponId)
        txb.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::place_and_list_coupon`,
            arguments: [
                txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
                txb.object(kioskId),
                txb.object(capId),
                txb.object(couponId as string),
                txb.pure.u64(trueMIST),
            ],
        })
        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui:testnet',
            },
            {
                onSuccess: result => {
                    console.log(result)
                },
            },
        )
    }

    return !couponData ? (
        <h1>Coupon not found</h1>
    ) : (
        <div className='card border w-[30%] mx-auto border-[#FFFFFF14] p-4 rounded-xl'>
            <div className='w-full flex items-center bg-black rounded-xl'>
                {couponData.imageURI ? (
                    <img
                        className='rounded-[inherit]'
                        src={couponData.imageURI}
                        alt={couponData.description}
                    />
                ) : (
                    <img
                        className='rounded-[inherit]'
                        src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                        alt='Shoes'
                    />
                )}
            </div>
            <section className='mt-4 flex flex-col gap-4'>
                <div className='flex justify-between items-center px-3'>
                    <div>
                        <p className='text-sm text-[#FFFFFF99]'>
                            by {couponData.brandName}
                        </p>
                        <h3 className='font-bold'>{couponData.itemDiscount}</h3>
                    </div>
                    <p className='text-[#FFFFFF99]'>
                        {(parseFloat(couponData.discount) / 2).toString()}% OFF
                    </p>
                </div>
                <div>
                    <div className='grid grid-cols-6'>
                        <input
                            className='p-2 col-span-2 mr-4 bg-[#222528] placeholder:text-sm placeholder:text-white rounded-md'
                            type='number'
                            placeholder='Input price...'
                            onChange={e =>
                                setSelectedPrice(parseFloat(e.target.value))
                            }
                        />
                        <Listbox
                            value={selectedKiosk}
                            onChange={setSelectedKiosk}
                        >
                            {({ open }) => (
                                <>
                                    <div className='relative col-span-4'>
                                        <Listbox.Button className='w-full h-full border border-[#6B7280] cursor-default rounded-md bg-[#222528] py-1.5 pl-3 pr-10 text-left text-white shadow-sm sm:text-sm sm:leading-6'>
                                            <span className='flex items-center'>
                                                <span className='block truncate'>
                                                    {selectedKiosk ||
                                                        'Select a kiosk'}
                                                </span>
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave='transition ease-in duration-100'
                                            leaveFrom='opacity-100'
                                            leaveTo='opacity-0'
                                        >
                                            <Listbox.Options className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-[#222528] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                                                {kiosks.map((kiosk, index) => (
                                                    <Listbox.Option
                                                        key={index}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            clsx(
                                                                active
                                                                    ? 'bg-[#22252850] text-[#4DA2FF]'
                                                                    : 'text-white',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                                            )
                                                        }
                                                        value={kiosk}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <div className='flex items-center'>
                                                                    <span
                                                                        className={clsx(
                                                                            selected
                                                                                ? 'font-semibold'
                                                                                : 'font-normal',
                                                                            'ml-3 block truncate',
                                                                        )}
                                                                    >
                                                                        {kiosk}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div>
                    <br />
                    <button
                        className='px-4 py-2 bg-[#4DA2FF] rounded-md'
                        onClick={e => {
                            e.preventDefault()
                            handleList()
                        }}
                    >
                        List
                    </button>
                </div>
            </section>
        </div>
    )
}
