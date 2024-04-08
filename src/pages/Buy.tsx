export function Buy() {
    return (
        <section className='flex gap-8 justify-center items-center flex-auto'>
            <img
                className='rounded-md'
                width='500px'
                src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                alt='Shoes'
            />
            <div>
                <h1 className='text-4xl font-bold'>Coupon Name</h1>
                <p className='text-sm'>by Company</p>
                <p className='text-sm'>Up to 50% OFF</p>
                <p className='text-lg'>Price: 0.003 SUI</p>
                <button className='px-6 py-2 bg-[#4DA2FF] rounded-md'>
                    Buy
                </button>
            </div>
        </section>
    )
}
