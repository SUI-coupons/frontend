import clsx from 'clsx'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import {
    useSuiClientQuery,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { Link } from 'react-router-dom'

interface CardProps {
    description: string
    brand: string
    status: string
    price: string
    discount: string
    imageURI: string
    coupon_id: string
    claimable: boolean
}

export function Card({
    coupon_id,
    description,
    brand,
    status,
    price,
    discount,
    imageURI,
    claimable,
}: CardProps) {
    console.log(claimable)
    const dateFormat = new Date(status * 1000).toLocaleDateString()
    const valid = new Date(status * 1000) > new Date()

    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransactionBlock()

    const handleClaim = () => {
        console.log(coupon_id.toString())
        console.log(description)
        const txb = new TransactionBlock()
        txb.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::claim_coupon`,
            arguments: [
                txb.object(coupon_id),
                txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
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

    return (
        <div className='card border border-[#FFFFFF14] p-4 rounded-xl'>
            <div className='w-full flex items-center bg-black rounded-xl'>
                {imageURI ? (
                    <img
                        className='rounded-[inherit]'
                        src={imageURI}
                        alt={description}
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
                        <p className='text-sm text-[#FFFFFF99]'>by {brand}</p>
                        {!claimable ? (
                            <Link to={`/coupons/${coupon_id.toString()}`}>
                                <h3 className='font-bold'>{description}</h3>
                            </Link>
                        ) : (
                            <h3 className='font-bold'>{description}</h3>
                        )}
                    </div>
                    <p className='text-[#FFFFFF99]'>
                        {(parseFloat(discount) * 100).toString()}% OFF
                    </p>
                </div>
                <div className='grid grid-cols-2 bg-[#FFFFFF1A] w-full rounded-lg px-3 py-2'>
                    <div>
                        <p className='text-[#FFFFFF99] text-[13px]'>
                            Available status
                        </p>
                        <p>{dateFormat}</p>
                    </div>
                    {!claimable ? (
                        <div className='justify-self-end'>Owned</div>
                    ) : (
                        <div className='justify-self-end'>
                            <button
                                disabled={!valid}
                                className={clsx(
                                    `px-4 py-2 bg-[#4DA2FF] rounded-md`,
                                    valid
                                        ? ''
                                        : 'bg-[#4DA2FF80] cursor-not-allowed',
                                )}
                                onClick={e => {
                                    e.preventDefault()
                                    handleClaim()
                                }}
                            >
                                Claim
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
