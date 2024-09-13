import { redirect } from "next/navigation";
import LoginCard from "~/components/layout/LoginCard";
import { auth } from "~/server/auth/auth";

export default async function Login() {
	const session = await auth();
	if (session) {
		redirect("/");
	}

	return (
		<div className="w-full flex justify-center items-center py-12 lg:py-24">
			<LoginCard />
		</div>
	);
}
