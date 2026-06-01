import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({
	label = "Caricamento",
	className,
	...props
}: { label?: string } & React.ComponentProps<typeof Loader2>) {
	return (
		<Loader2
			role="status"
			aria-label={label}
			className={cn("text-primary size-8 animate-spin", className)}
			{...props}
		/>
	);
}

export { Spinner };
