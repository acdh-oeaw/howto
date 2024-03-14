import type { ReactNode } from "react";

interface QuizSuccessMessageProps {
	children: ReactNode
}

export function QuizSuccessMessage(props: QuizSuccessMessageProps): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}
