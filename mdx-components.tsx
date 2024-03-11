import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/content/callout";
import { Disclosure } from "@/components/content/disclosure";
import { Download } from "@/components/content/download";
import { Figure } from "@/components/content/figure";
import {
	FootnoteContent,
	FootnoteReference,
	FootnotesSection,
} from "@/components/content/footnote";
import { Image } from "@/components/content/image";
import { Quiz, QuizMultipleChoice, QuizSingleChoice } from "@/components/content/quiz";
import { Tab, Tabs } from "@/components/content/tabs";
import { Video } from "@/components/content/video";
import { Link } from "@/components/link";

const shared = {
	a: Link,
	Callout,
	Disclosure,
	Download,
	Figure,
	FootnoteContent,
	FootnoteReference,
	FootnotesSection,
	img: Image,
	Quiz,
	QuizMultipleChoice,
	QuizSingleChoice,
	Tabs,
	Tab,
	Video,
} as MDXComponents;

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...shared,
		...components,
	};
}
