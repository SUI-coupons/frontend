// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount } from '@mysten/dapp-kit'

import { Loading } from '../components/Base/Loading'
import { WalletNotConnected } from '../components/Base/WalletNotConnected'
import { KioskCreation } from '../components/Kiosk/KioskCreation'
import { KioskData } from '../components/Kiosk/KioskData'
import { KioskSelector } from '../components/Kiosk/KioskSelector'
import { useOwnedKiosk } from '../hooks/kiosk'
import { useKioskSelector } from '../hooks/useKioskSelector'
import { useCreateKioskMutation } from '../mutations/kiosk'
import { Button } from '../components/Base/Button'

function Home() {
    const currentAccount = useCurrentAccount()

    const {
        data: ownedKiosk,
        isPending,
        refetch: refetchOwnedKiosk,
    } = useOwnedKiosk(currentAccount?.address)

    const { mutate: createKiosk } = useCreateKioskMutation({
        onSuccess: () => {
            refetchOwnedKiosk()
        },
    })

    const { selected, setSelected, showKioskSelector } = useKioskSelector(
        currentAccount?.address,
    )

    // Return loading state.
    if (isPending) return <Loading />

    // Return wallet not connected state.
    if (!currentAccount?.address) return <WalletNotConnected />

    // if the account doesn't have a kiosk.
    if (!ownedKiosk?.kioskId)
        return <KioskCreation onCreate={refetchOwnedKiosk} />

    const handleCreateKiosk = () => {
        createKiosk()
    }

    // kiosk management screen.
    return (
        <div className='container'>
            <div className='flex flex-row-reverse justify-between items-center'>
                <Button
                    onClick={e => {
                        e.preventDefault()
                        handleCreateKiosk()
                    }}
                >
                    Create new Kiosk
                </Button>
                {showKioskSelector && selected && (
                    <div className=''>
                        <KioskSelector
                            caps={ownedKiosk.caps}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>
                )}
            </div>
            {selected && currentAccount?.address && (
                <KioskData kioskId={selected.kioskId} />
            )}
        </div>
    )
}

export default Home
