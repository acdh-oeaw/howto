import type { ReactNode } from "react";

interface DownloadProps {
	children: ReactNode;
	href: string;
}

export function Download(props: DownloadProps) {
	const { children, href } = props;

	return (
		<a download={true} href={href}>
			{children}
		</a>
	);
}
