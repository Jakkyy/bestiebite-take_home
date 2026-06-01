import Link from "next/link";

export default function Header() {
	return (
		<header
			id="header"
			className="bg-background border-border sticky top-0 z-50 h-16 border-b">
			<div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-16">
				<div className="flex items-center gap-2">
					<Link
						href="/"
						aria-label="Home (Vai alla home)"
						className="text-lg font-bold tracking-wide">
						Bestie Bite
					</Link>
				</div>
				<div className="flex items-center gap-8">
					<Link
						aria-label="Per ristoranti (Vai alla sezione ristoranti)"
						rel="noopener noreferrer"
						className="text-muted hover:text-primary font-light transition-colors duration-300"
						href="/#ristoranti">
						Per ristoranti
					</Link>
					<Link
						aria-label="Accedi (Vai alla sezione accedi)"
						rel="noopener noreferrer"
						className="text-muted hover:text-primary font-light transition-colors duration-300"
						href="/#accedi">
						Accedi
					</Link>
				</div>
			</div>
		</header>
	);
}
