import { Select } from "@radix-ui/themes";
import {
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useState } from "react";
import { Modal } from "flowbite-react";

export function Register() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();
  const [digest, setDigest] = useState("");
  const [inputWallet, setInputWallet] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState("");

  const submitForm = (e: any) => {
    e.preventDefault();
    // submit type
    const selectedType = e.currentTarget.elements.namedItem("type")?.value;
    const txb = new TransactionBlock();
    // const [coin] = transactionBlock.splitCoins(transactionBlock.gas, [1]);
    if (selectedType === "publisher") {
      txb.moveCall({
        target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::register_publisher`,
        arguments: [
          txb.object(`${import.meta.env.VITE_ADMIN_CAP}`),
          txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
          txb.pure.address(inputWallet),
        ],
      });
    } else {
      txb.moveCall({
        target: `${import.meta.env.VITE_PACKAGE_ID}::coupons::register_seller`,
        arguments: [
          txb.object(`${import.meta.env.VITE_STATE_OBJECT_ID}`),
          txb.pure.address(inputWallet),
        ],
      });
    }
    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        chain: "sui:testnet",
      },
      {
        onSuccess: (result) => {
          setDigest(result.digest);
          setType(selectedType);
          setModalOpen(true);
        },
      },
    );
  };

  return (
    <section>
      <form
        className="flex flex-col gap-4 items-center justify-center"
        onSubmit={submitForm}
      >
        <h1 className="text-4xl font-bold">Register</h1>
        <input
          className="p-2 w-[400px] bg-[#222528] placeholder:text-white rounded-md"
          placeholder="Wallet Address"
          onChange={(e) => {
            setInputWallet(e.currentTarget.value);
          }}
        />
        <Select.Root size="3" defaultValue="publisher" name="type">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="publisher">Publisher</Select.Item>
            <Select.Item value="store">Store</Select.Item>
          </Select.Content>
        </Select.Root>
        <button className="p-2 w-[400px] bg-[#4DA2FF] rounded-md">
          Register
        </button>
      </form>
      <Modal
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto text-white",
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg shadow bg-[#222528]",
          },
          header: {
            base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600",
            popup: "border-b-0 p-2",
            title: "text-xl font-medium text-white",
            close: {
              base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
              icon: "h-5 w-5",
            },
          },
        }}
        show={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>Registration Result</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-white">
              Your registration for {type} has been submitted. Please wait for
              the transaction to be confirmed.
            </p>
            <p className="text-white">Transaction digest: {digest}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="px-4 py-2 bg-[#4DA2FF] rounded-md"
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
