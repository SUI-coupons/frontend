import { Select } from "@radix-ui/themes";

export function Register() {
    const submitForm = (e: any) => {
        e.preventDefault();
        console.log("Form submitted");
        
    }

    return (
        <section>
            <form className="flex flex-col gap-4 items-center justify-center" onSubmit={submitForm}>
                <h1 className="text-4xl font-bold">Register</h1>
                <input className="p-2 w-[400px] bg-[#222528] placeholder:text-white rounded-md" placeholder="Wallet Address" />
                <Select.Root size="3" defaultValue="publisher">
                    <Select.Trigger />
                    <Select.Content>
                    <Select.Item value="publisher">Publisher</Select.Item>
                    <Select.Item value="store">Store</Select.Item>
                    </Select.Content>
                </Select.Root>
                <button className="p-2 w-[400px] bg-[#4DA2FF] rounded-md">Register</button>
            </form>   
        </section>
    )
}