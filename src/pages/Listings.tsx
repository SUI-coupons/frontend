import { useLoaderData } from "react-router-dom";
import { Card } from "../components/Card";

export function walletLoader({ params }) {
    const walletAddress = params.walletAddress;
    return { walletAddress };
  }

export function Listings() {
    const { walletAddress } = useLoaderData();
    return (
        <>
            <h1>Wallet: { walletAddress }</h1>
            <section className="flex gap-8 justify-center">
                <Card name="Coupon Name" company="Company" status="Available" price="0.003" image="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" />
            </section>
        </>
    )
}