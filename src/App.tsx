import { ConnectButton, ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, TextField } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function App() {
  const currentAccount = useCurrentAccount();
	const [open, setOpen] = useState(false);
  return (
    <main className="bg-[#191C1F] min-h-[100vh] flex flex-col">
      <Flex
        position="sticky"
        justify="between"
        style={{
          borderBottom: "1px solid #FFFFFF80)",
        }}
        className="mb-8 px-40 py-4 border-b border-[#FFFFFF78] text-white items-center"
      >
        <div className="flex gap-4 items-center">
          <input className="w-[400px] bg-[#222528] placeholder:text-white p-2 rounded-md" placeholder="Search coupons..." />
          <div className="flex gap-4">
            <Link to={'/'}>Explore</Link>
            <Link to={'/my-listings'}>My Listings</Link>
          </div>
        </div>

        <Box>
          <ConnectModal
            trigger={
              <button className="bg-[#4DA2FF] p-2 rounded-md" disabled={!!currentAccount}> {currentAccount ? 'My coupons' : 'Connect'}</button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
          />
        </Box>
      </Flex>
      <section className="px-20 flex-auto flex flex-col">
        <Outlet />
      </section>
    </main>
  );
}

export default App;
