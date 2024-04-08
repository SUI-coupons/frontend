import { Select } from '@radix-ui/themes'
import {
    useSuiClientQuery,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { useState } from 'react'

export function Register() {
    const currentAccount = useCurrentAccount()
    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransactionBlock()
    const [digest, setDigest] = useState('')
    const [inputWallet, setInputWallet] = useState('')

    const submitForm = (e: any) => {
        e.preventDefault()
        // submit type
        const selectedType = e.currentTarget.elements.namedItem('type')?.value
        const txb = new TransactionBlock()
        // const [coin] = transactionBlock.splitCoins(transactionBlock.gas, [1]);
        if (selectedType === 'publisher') {
            txb.moveCall({
                target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::register_publisher`,
                arguments: [
                    txb.object(`${import.meta.env.VITE_ADMIN_CAP}`),
                    txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
                    txb.pure.address(inputWallet),
                ],
            })
        } else {
            txb.moveCall({
                target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::register_seller`,
                arguments: [
                    txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
                    txb.pure.address(inputWallet),
                ],
            })
        }
        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui:testnet',
            },
            {
                onSuccess: result => {
                    setDigest(result.digest)
                    alert(
                        'register ' +
                            selectedType +
                            ' successfully \n' +
                            digest,
                    ) // link to digest explorer
                },
            },
        )
    }

    return (
        <section>
            <form
                className='flex flex-col gap-4 items-center justify-center'
                onSubmit={submitForm}
            >
                <h1 className='text-4xl font-bold'>Register</h1>
                <input
                    className='p-2 w-[400px] bg-[#222528] placeholder:text-white rounded-md'
                    placeholder='Wallet Address'
                    onChange={e => {
                        setInputWallet(e.currentTarget.value)
                    }}
                />
                <Select.Root size='3' defaultValue='publisher' name='type'>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value='publisher'>Publisher</Select.Item>
                        <Select.Item value='store'>Store</Select.Item>
                    </Select.Content>
                </Select.Root>
                <button className='p-2 w-[400px] bg-[#4DA2FF] rounded-md'>
                    Register
                </button>
            </form>
        </section>
    )
}
