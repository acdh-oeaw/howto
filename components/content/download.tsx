import type { ReactNode } from "react";

interface DownloadProps{
	href: string
	title: string
}

export function Download(props: DownloadProps): ReactNode {
	const { href, title} = props

	return <a download={true} href={href}>{title}</a>
}
