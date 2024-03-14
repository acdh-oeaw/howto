import type { ReactNode } from "react";

import {
	Card as CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface CardProps {
	children?: ReactNode;
	description: ReactNode;
	footer?: ReactNode;
	image?: string;
	headingLevel?: 1 | 2 | 3 | 4;
	title: ReactNode;
}

export function Card(props: CardProps) {
	const { children, description, footer, headingLevel, image, title, ...rest } = props;

	return (
		<CardContent {...rest}>
			{image != null ? (
				<div className="relative -mx-6 -mt-6 aspect-video overflow-auto rounded-t-md border-b">
					<img alt="" className="absolute inset-0 size-full object-cover" src={image} />
				</div>
			) : null}
			<CardHeader>
				<CardTitle level={headingLevel}>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			{children}
			{footer != null ? <CardFooter>{footer}</CardFooter> : null}
		</CardContent>
	);
}
