"use client";

import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { icons } from "../social-icons";
import { Button } from "../ui/button";

const providers = [
	{
		id: "discord",
		name: "Discord",
	},
];

export default function LoginCard() {
	return (
		<Card className="max-w-sm w-full">
			<CardHeader>
				<CardTitle className="text-xl text-center">Login</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-5">
					{providers.map((p) => {
						return (
							<Button
								onClick={() => void signIn(p.id)}
								key={p.id}
								variant="outline"
								className="gap-x-3"
							>
								{icons[p.id]}
								{p.name}
							</Button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
