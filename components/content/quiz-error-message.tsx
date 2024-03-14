import type { ReactNode } from "react";

interface QuizErrorMessageProps {
	children: ReactNode
}

export function QuizErrorMessage(props: QuizErrorMessageProps): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}
