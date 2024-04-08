interface CardProps {
    name: string
    company: string
    status: string
    price: string
    image: string
}

export function Card({ name, company, status, price, image }: CardProps) {
    return (
        <div className='card border border-[#FFFFFF14] p-4 rounded-xl'>
            <div className='w-[275px] h-[250px] flex items-center bg-black rounded-xl'>
                <img
                    src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                    alt='Shoes'
                />
            </div>
            <section className='mt-4 flex flex-col gap-4'>
                <div className='flex justify-between items-center px-3'>
                    <div>
                        <p className='text-sm text-[#FFFFFF99]'>by {company}</p>
                        <h3 className='font-bold'>{name}</h3>
                    </div>
                    <p className='text-[#FFFFFF99]'>50% OFF</p>
                </div>
                <div className='grid grid-cols-2 bg-[#FFFFFF1A] w-full rounded-lg px-3 py-2'>
                    <div>
                        <p className='text-[#FFFFFF99] text-[13px]'>Status</p>
                        <p>{status}</p>
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
                            <button className='px-4 py-2 bg-[#4DA2FF] rounded-md'>
                                Claim
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
