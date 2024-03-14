import "server-only";

import { codeToHtml } from "shiki";

import { config as syntaxHighlighterConfig } from "@/config/syntax-highlighter.config.js";

interface CodeBlockProps {
	code: string;
	language: string;
}

export async function CodeBlock(props: CodeBlockProps) {
	const { code, language } = props;

	const html = await codeToHtml(code, {
		...syntaxHighlighterConfig,
		lang: language,
	});

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
