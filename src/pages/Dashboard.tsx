import { Flex } from "@radix-ui/themes";
import { Card } from "../components/Card";

export function Dashboard() {
    return (
        <div className="flex justify-between">
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
    );
}