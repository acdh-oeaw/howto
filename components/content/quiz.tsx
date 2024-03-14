"use client";

import { assert } from "@acdh-oeaw/lib";
import { createContext, type ReactNode, useContext, useState } from "react";

import { getChildrenElements } from "@/lib/get-children-elements";

interface QuizProps {
	children: ReactNode;
}

export function Quiz(props: QuizProps) {
	const { children } = props;

	const quizzes = getChildrenElements(children);

	const [currentIndex, setCurrentIndex] = useState(0);

	const value: Omit<QuizContextValue, "isCurrent"> = {
		navigation: {
			hasNext: currentIndex < quizzes.length - 1,
			hasPrevious: currentIndex > 0,
			next() {
				setCurrentIndex((currentIndex) => {
					return currentIndex + 1;
				});
			},
			previous() {
				setCurrentIndex((currentIndex) => {
					return currentIndex - 1;
				});
			},
		},
	};

	return (
		<aside>
			{quizzes.map((quiz, index) => {
				const isCurrent = index === currentIndex;

				return (
					<QuizContext.Provider key={index} value={{ ...value, isCurrent }}>
						{quiz}
					</QuizContext.Provider>
				);
			})}
		</aside>
	);
}

interface QuizContextValue {
	isCurrent: boolean;
	navigation: {
		hasNext: boolean;
		hasPrevious: boolean;
		next: () => void;
		previous: () => void;
	};
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function useQuizContext(): QuizContextValue {
	const value = useContext(QuizContext);
	assert(value != null);
	return value;
}

interface QuizSuccessMessageProps {
	children: ReactNode;
}

export function QuizSuccessMessage(props: QuizSuccessMessageProps) {
	const { children } = props;

	return children;
}

interface QuizErrorMessageProps {
	children: ReactNode;
}

export function QuizErrorMessage(props: QuizErrorMessageProps) {
	const { children } = props;

	return children;
}
