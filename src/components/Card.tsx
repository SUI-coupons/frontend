import clsx from 'clsx'

interface CardProps {
    description: string
    brand: string
    status: string
    price: string
    discount: string
    image: string
}

export function Card({
    description,
    brand,
    status,
    price,
    discount,
    image,
}: CardProps) {
    const dateFormat = new Date(status * 1000).toLocaleDateString()
    const valid = new Date(status * 1000) > new Date()
    return (
        <div className='card border border-[#FFFFFF14] p-4 rounded-xl'>
            <div className='w-full flex items-center bg-black rounded-xl'>
                <img
                    className='rounded-[inherit]'
                    src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                    alt='Shoes'
                />
            </div>
            <section className='mt-4 flex flex-col gap-4'>
                <div className='flex justify-between items-center px-3'>
                    <div>
                        <p className='text-sm text-[#FFFFFF99]'>by {brand}</p>
                        <h3 className='font-bold'>{description}</h3>
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
                    {price ? (
                        <div>
                            <p className='text-[#FFFFFF99] text-[13px]'>
                                Price
                            </p>
                            <p>{price} SUI</p>
                        </div>
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
