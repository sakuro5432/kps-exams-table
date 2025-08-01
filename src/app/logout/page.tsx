import { ForceLogout } from "@/components/ForceLogout";
import { Auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const isAuth = await Auth()
    if (!isAuth) redirect("/")
    return <ForceLogout />
}