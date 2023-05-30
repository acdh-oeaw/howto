import Link from "next/link";

import RssIcon from "@/assets/icons/rss.svg?symbol";
import { Icon } from "@/common/Icon";
import { useI18n } from "@/i18n/useI18n";
import { useSiteMetadata } from "@/metadata/useSiteMetadata";
import { routes } from "@/navigation/routes.config";
import { feedFileName } from "~/config/site.config";

/**
 * Page footer.
 */
export function PageFooter(): JSX.Element {
	const { creator } = useSiteMetadata();
	const { t } = useI18n();

	return (
		<footer className="flex items-center justify-between space-x-8 px-4 py-8">
			<div className="flex items-center gap-4">
				<small>
					<span>&copy; </span>
					{creator != null ? (
						<a
							href={creator.website}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
						>
							{creator.shortName ?? creator.name}
						</a>
					) : null}
					<span> {new Date().getFullYear()}</span>
				</small>
				<small>
					<Link
						className="rounded transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
						href={routes.imprint()}
					>
						{t("common.page.imprint")}
					</Link>
				</small>
			</div>
			<small>
				<a
					href={"/" + feedFileName}
					className="flex items-center space-x-1 rounded transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
				>
					<Icon icon={RssIcon} className="h-5 w-5 shrink-0" />
					<span>RSS Feed</span>
				</a>
			</small>
		</footer>
	);
}
