import { ArrowLeftSquareIcon } from "lucide-react";
import { Children, type ReactNode } from "react";

interface FootnotesSectionProps {
	children: ReactNode;
}

export function FootnotesSection(props: FootnotesSectionProps) {
	const { children } = props;

	const footnotes = Children.toArray(children);

	return (
		<section>
			<h2 className="sr-only">Footnotes</h2>
			<ol className="grid gap-y-3 text-xs">
				{footnotes.map((footnote, index) => {
					return <li key={index}>{footnote}</li>;
				})}
			</ol>
		</section>
	);
}

interface FootnoteReferenceProps {
	count: number;
}

export function FootnoteReference(props: FootnoteReferenceProps) {
	const { count } = props;

	return (
		<a href={`#${createFootnoteContentId(count)}`} id={createFootnoteReferenceId(count)}>
			<sup>{count}</sup>
		</a>
	);
}

interface FootnoteContentProps {
	children: ReactNode;
	count: number;
}

export function FootnoteContent(props: FootnoteContentProps) {
	const { children, count } = props;

	return (
		<div id={createFootnoteContentId(count)}>
			{children}
			<a className="ml-1.5" href={`#${createFootnoteReferenceId(count)}`}>
				<ArrowLeftSquareIcon
					aria-hidden={true}
					className="inline size-4 shrink-0 stroke-1 align-sub text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-0"
				/>
				<span className="sr-only">Back to footnote {count}</span>
			</a>
		</div>
	);
}

function createFootnoteReferenceId(count: number) {
	return `fn-ref-${count}`;
}

function createFootnoteContentId(count: number) {
	return `fn-${count}`;
}
