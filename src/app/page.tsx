import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function Home() {
  if (await getServerSession()) {
    redirect("/recipes");
  } else {
    redirect("/recipes");
  }
}