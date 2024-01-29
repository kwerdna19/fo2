"use client";
import { Loader2 } from "lucide-react";
import { type ReactNode, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "~/components/ui/button";

export interface FormButtonProps extends ButtonProps {
	icon?: ReactNode;
}

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
	({ children, icon, disabled, ...rest }, ref) => {
		const status = useFormStatus();

		return (
			<Button ref={ref} disabled={status.pending || disabled} {...rest}>
				{status.pending ? (
					<Loader2 className="animate-spin h-4 w-4 mr-2" />
				) : (
					icon
				)}
				{children}
			</Button>
		);
	},
);
FormButton.displayName = "FormButton";
