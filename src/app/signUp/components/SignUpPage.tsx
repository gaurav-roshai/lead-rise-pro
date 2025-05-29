"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function SignUpPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	return (
		<section className="flex w-full h-screen font-sora">
			<div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-12 relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
				<div className="absolute top-20 left-20 w-72 h-72 bg-[#1d91d8] rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
				</div>
				
				<div className="relative z-10 text-white max-w-lg">
				{/* Logo/Brand */}
				<div className="mb-8">
					<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 mb-4">
					<Image
					src="/logo-lead.svg"
					alt="Logo"
					width={32}
					height={32}
					className="w-full h-full"
					/>
					</div>
					<h1 className="text-3xl font-bold flex items-center gap-0">
					<span className="text-slate-800">Lead</span>
					<span className="text-[#1D91D8]">Rise</span>
					<sup className="text-xs ml-1 text-slate-600 font-medium">
						Pro
					</sup>
					</h1>
					</div>

				{/* Value Proposition */}
				<div className="space-y-6">
					<h2 className="text-4xl font-bold leading-tight">
					Power your business with our 
					<span className="text-[#1d91d8]"> intelligent platform</span>
					</h2>
					
					<p className="text-xl text-slate-300 leading-relaxed">
					Join us to rely on our CRM platform to manage customer relationships, automate sales processes, and accelerate revenue growth.
					</p>

					{/* Feature highlights */}
					<div className="space-y-4 mt-8">
					<div className="flex items-center space-x-3">
						<div className="w-2 h-2 bg-[#1d91d8] rounded-full"></div>
						<span className="text-slate-300">Advanced analytics and reporting</span>
					</div>
					<div className="flex items-center space-x-3">
						<div className="w-2 h-2 bg-[#1d91d8] rounded-full"></div>
						<span className="text-slate-300">Great User Experience</span>
					</div>
					<div className="flex items-center space-x-3">
						<div className="w-2 h-2 bg-[#1d91d8] rounded-full"></div>
						<span className="text-slate-300">Curated lead tracking for Startups</span>
					</div>
					</div>
					<p className="text-sm text-slate-400 mb-4">Powered by RoshAi</p>

				</div>
				</div>
			</div>
		<div className="flex-1 flex justify-center items-center">
			<Card className="z-50 rounded-md max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name">First name</Label>
							<Input
								id="first-name"
								placeholder="Max"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">Last name</Label>
							<Input
								id="last-name"
								placeholder="Robinson"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Password"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Confirm Password</Label>
						<Input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="Confirm Password"
						/>
					</div>
					<Button
						type="submit"
						className="w-full bg-[#1d91d8] hover:bg-gray-600"
						disabled={loading}
						onClick={async () => {
							await signUp.email({
								email,
								password,
								name: `${firstName} ${lastName}`,
								callbackURL: "/dashboard",
								fetchOptions: {
									onResponse: () => {
										setLoading(false);
									},
									onRequest: () => {
										setLoading(true);
									},
									onError: (ctx) => {
										toast.error(ctx.error.message);
									},
									onSuccess: async () => {
										router.push("/dashboard");
									},
								},
							});
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Create an account"
						)}
					</Button>
					<div>
						<p className="text-xs text-center text-gray-500 mt-4">
							Already have an account?
							<a href="/signIn" className="text-[#1d91d8] font-medium ml-1">
							Sign In
							</a>
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
		</div>
	</section>
	);
}
