import clsx from 'clsx'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import {
    useSuiClientQuery,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { Modal } from 'flowbite-react'
import { useState } from 'react'
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
    const dateFormat = new Date(status * 1000).toLocaleDateString()
    const valid = new Date(status * 1000) > new Date()
    const [modalOpen, setModalOpen] = useState(false)
    const [modalText, setModalText] = useState('')
    const [hasError, setHasError] = useState(false)
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
                    setModalText('Coupon has been claimed successfully.')
                    setHasError(false)
                    setModalOpen(true)
                },
                onError: error => {
                    setModalText(error.message)
                    setHasError(true)
                    setModalOpen(true)
                },
            },
        )
    }

    return (
        <div className='card border border-[#FFFFFF14] p-4 rounded-xl'>
            <div className='w-full h-[250px] flex items-center bg-transparent rounded-xl'>
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
                        <div className='justify-self-end'>Place</div>
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
            <Modal
                theme={{
                    content: {
                        base: 'relative h-full w-full p-4 md:h-auto text-white',
                        inner: 'relative flex max-h-[90dvh] flex-col rounded-lg shadow bg-[#222528]',
                    },
                    header: {
                        base: 'flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600',
                        popup: 'border-b-0 p-2',
                        title: 'text-xl font-medium text-white',
                        close: {
                            base: 'ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
                            icon: 'h-5 w-5',
                        },
                    },
                }}
                show={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <Modal.Header>Coupon Claim Result</Modal.Header>
                <Modal.Body>
                    <div className='space-y-6'>
                        <p
                            className={clsx(
                                `${hasError ? 'text-red-400' : 'text-white'}`,
                            )}
                        >
                            {modalText}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className='px-4 py-2 bg-[#4DA2FF] rounded-md'
                        onClick={() => setModalOpen(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
