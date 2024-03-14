import { pick } from "@acdh-oeaw/lib";
import { collection, config, fields, NotEditable } from "@keystatic/core";
import { mark, repeating, wrapper } from "@keystatic/core/content-components";
import {
	CaptionsIcon,
	DownloadIcon,
	ExpandIcon,
	ImageIcon,
	InfoIcon,
	MessageCircleQuestionIcon,
	SuperscriptIcon,
	VideoIcon,
} from "lucide-react";
/** Only needed for `tsx`. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";

import { Callout } from "@/components/content/callout";
import { Logo } from "@/components/logo";
import { createAssetPaths, createPreviewUrl } from "@/config/content.config";
import { env } from "@/config/env.config";
import { defaultLocale, locales } from "@/config/i18n.config";

const localeLabel = new Intl.DisplayNames("en", { type: "language" });

function createComponents(
	assetPath: `/${string}/`,
	components?: Array<
		| "Callout"
		| "Disclosure"
		| "Download"
		| "Figure"
		| "Footnote"
		| "Quiz"
		| "QuizChoice"
		| "QuizChoiceAnswer"
		| "QuizChoiceQuestion"
		| "Tab"
		| "Tabs"
		| "Video"
	>,
) {
	const allComponents = {
		Callout: wrapper({
			label: "Callout",
			description: "A panel with additional information.",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					/** @see https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts */
					options: [
						{ label: "Caution", value: "caution" },
						{ label: "Important", value: "important" },
						{ label: "Note", value: "note" },
						{ label: "Tip", value: "tip" },
						{ label: "Warning", value: "warning" },
					],
					defaultValue: "note",
				}),
				title: fields.text({
					label: "Title",
					// validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;
				return (
					<Callout kind={value.kind} title={<NotEditable>{value.title}</NotEditable>}>
						{children}
					</Callout>
				);
			},
		}),
		Disclosure: wrapper({
			label: "Disclosure",
			description: "An expandable panel.",
			icon: <ExpandIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
		}),
		Download: mark({
			label: "Download",
			icon: <DownloadIcon />,
			className: "underline decoration-dotted",
			schema: {
				href: fields.file({
					label: "File",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
			},
		}),
		Figure: wrapper({
			label: "Figure",
			description: "An image with caption.",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					...createAssetPaths(assetPath),
					validation: { isRequired: true },
				}),
				alt: fields.text({
					label: "Image description for screen readers",
					// validation: { isRequired: false },
				}),
			},
		}),
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			className: "underline decoration-dotted align-super text-sm",
			schema: {},
		}),
		Quiz: repeating({
			label: "Quiz",
			description: "An interactive quiz.",
			icon: <MessageCircleQuestionIcon />,
			children: ["QuizChoice"],
			validation: { children: { min: 1 } },
			schema: {},
		}),
		QuizChoice: repeating({
			label: "Choice quiz",
			description: "A single or multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			children: [
				"QuizChoiceQuestion",
				"QuizChoiceAnswer",
				"QuizSuccessMessage",
				"QuizErrorMessage",
			],
			validation: { children: { min: 1 } },
			schema: {
				variant: fields.select({
					label: "Variant",
					options: [
						{ label: "Single choice", value: "single" },
						{ label: "Multiple choice", value: "multiple" },
					],
					defaultValue: "multiple",
				}),
				buttonLabel: fields.text({
					label: "Button label",
					description: "Custom label for 'Check answer' button.",
					// validation: { isRequired: fields },
				}),
			},
		}),
		QuizChoiceAnswer: wrapper({
			label: "Answer",
			description: "An answer in a single/multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {
				kind: fields.select({
					label: "Kind",
					options: [
						{ label: "Correct", value: "correct" },
						{ label: "Incorrect", value: "incorrect" },
					],
					defaultValue: "incorrect",
				}),
			},
			ContentView(props) {
				return (
					<div>
						<NotEditable>
							{props.value.kind === "correct" ? "Correct" : "Incorrect"} answer:
						</NotEditable>
						{props.children}
					</div>
				);
			},
		}),
		QuizChoiceQuestion: wrapper({
			label: "Question",
			description: "A question in a single/multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
		}),
		QuizErrorMessage: wrapper({
			label: "Quiz error message",
			description: "Help text for incorrect answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
		}),
		QuizSuccessMessage: wrapper({
			label: "Quiz success message",
			description: "Help text for correct answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
		}),
		Tab: wrapper({
			label: "Tab",
			description: "A tab.",
			icon: <CaptionsIcon />,
			forSpecificLocations: true,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
		}),
		Tabs: repeating({
			label: "Tabs",
			description: "Multiple tabs.",
			icon: <CaptionsIcon />,
			children: ["Tab"],
			schema: {},
		}),
		Video: wrapper({
			label: "Video",
			description: "A YouTube video.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: [{ label: "YouTube", value: "youtube" }],
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video identifier",
					description: "The YouTube video id.",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					// validation: { isRequired: false },
				}),
			},
		}),
	};

	if (components == null) return allComponents;

	return pick(allComponents, components);
}

// eslint-disable-next-line import/no-default-export
export default config({
	ui: {
		brand: {
			name: "ACDH-CH",
			// @ts-expect-error `ReactNode` is a valid return type.
			mark: Logo,
		},
		navigation: {
			Content: ["resources", "curricula"],
			Data: ["people", "tags", "licenses"],
			// Pages: ["homePage"],
			Documentation: ["documentation"],
			// Settings: [],
		},
	},
	storage:
		/**
		 * @see https://keystatic.com/docs/github-mode
		 */
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	collections: {
		curricula: collection({
			label: "Curricula",
			path: "./content/curricula/*/",
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/curricula/{slug}"),
			entryLayout: "content",
			columns: ["title", "publicationDate"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				shortTitle: fields.text({
					label: "Short title",
					// validation: { isRequired: false },
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					validation: { isRequired: true },
				}),
				locale: fields.select({
					label: "Language",
					options: locales.map((locale) => {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						return { label: localeLabel.of(locale)!, value: locale };
					}),
					defaultValue: defaultLocale,
				}),
				editors: fields.array(
					fields.relationship({
						collection: "people",
						label: "Editor",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select an editor";
						},
						label: "Editors",
						// validation: { length: { min: 0 } },
					},
				),
				publicationDate: fields.date({
					label: "Publication date",
					defaultValue: { kind: "today" },
					validation: { isRequired: true },
				}),
				version: fields.text({
					label: "Version",
					defaultValue: "1.0.0",
					validation: { isRequired: true },
				}),
				featuredImage: fields.image({
					label: "Featured image",
					...createAssetPaths("/content/curricula/"),
					// validation: { isRequired: false },
				}),
				tags: fields.array(
					fields.relationship({
						collection: "tags",
						label: "Tag",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select a tag";
						},
						label: "Tags",
						validation: { length: { min: 1 } },
					},
				),
				license: fields.relationship({
					collection: "licenses",
					label: "License",
					validation: { isRequired: true },
				}),
				resources: fields.array(
					fields.relationship({
						collection: "resources",
						label: "Resource",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select a resource";
						},
						label: "Resources",
						validation: { length: { min: 1 } },
					},
				),
				content: fields.mdx({
					label: "Content",
					options: {
						image: createAssetPaths("/content/curricula/"),
					},
					components: createComponents("/content/curricula/"),
				}),
			},
		}),
		resources: collection({
			label: "Resources",
			path: "./content/resources/*/",
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/resources/{slug}"),
			entryLayout: "content",
			columns: ["title", "publicationDate"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				shortTitle: fields.text({
					label: "Short title",
					// validation: { isRequired: false },
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					validation: { isRequired: true },
				}),
				locale: fields.select({
					label: "Language",
					options: locales.map((locale) => {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						return { label: localeLabel.of(locale)!, value: locale };
					}),
					defaultValue: defaultLocale,
				}),
				authors: fields.array(
					fields.relationship({
						collection: "people",
						label: "Author",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select an author";
						},
						label: "Authors",
						validation: { length: { min: 1 } },
					},
				),
				editors: fields.array(
					fields.relationship({
						collection: "people",
						label: "Editor",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select an editor";
						},
						label: "Editors",
						// validation: { length: { min: 0 } },
					},
				),
				// contributors: fields.array(
				// 	fields.relationship({
				// 		collection: "people",
				// 		label: "Contributor",
				// 		validation: { isRequired: true },
				// 	}),
				// 	{
				// 		itemLabel(props) {
				// 			return props.value ?? "Select a contributor";
				// 		},
				// 		label: "Contributors",
				// 		// validation: { length: { min: 1 }}
				// 	},
				// ),
				publicationDate: fields.date({
					label: "Publication date",
					defaultValue: { kind: "today" },
					validation: { isRequired: true },
				}),
				version: fields.text({
					label: "Version",
					defaultValue: "1.0.0",
					validation: { isRequired: true },
				}),
				featuredImage: fields.image({
					label: "Featured image",
					...createAssetPaths("/content/resources/"),
					// validation: { isRequired: false },
				}),
				tags: fields.array(
					fields.relationship({
						collection: "tags",
						label: "Tag",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select a tag";
						},
						label: "Tags",
						validation: { length: { min: 1 } },
					},
				),
				license: fields.relationship({
					collection: "licenses",
					label: "License",
					validation: { isRequired: true },
				}),
				toc: fields.checkbox({
					label: "Display table of contents",
					defaultValue: true,
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						image: createAssetPaths("/content/resources/"),
					},
					components: createComponents("/content/resources/"),
				}),
			},
		}),
		people: collection({
			label: "People",
			path: "./content/people/*",
			slugField: "lastName",
			format: { data: "json" },
			previewUrl: createPreviewUrl("/people/{slug}"),
			entryLayout: "form",
			columns: ["lastName", "firstName"],
			schema: {
				lastName: fields.slug({
					name: {
						label: "Last name",
						validation: { isRequired: true },
					},
				}),
				firstName: fields.text({
					label: "First name",
					// validation: {isRequired: true },
				}),
				title: fields.text({
					label: "Title",
					// validation: {isRequired: true },
				}),
				image: fields.image({
					label: "Image",
					...createAssetPaths("/content/people/"),
					// validation: { isRequired: true },
				}),
				website: fields.url({
					label: "Website",
					// validation: { isRequired: true },
				}),
				// email: fields.text({
				// 	label: "Email",
				// 	// vaisRequired: truein: 1 } },
				// }),
				// orcid: fields.text({
				// 	label: "ORCID",
				// 	// vaisRequired: truein: 1 } },
				// }),
				// twitter: fields.text({
				// 	label: "Twitter",
				// 	// vaisRequired: truein: 1 } },
				// }),
				// shortBio: fields.text({
				// 	label: "Short biography",
				// 	multiline: true,
				// 	validation: {isRequired: true },
				// }),
			},
		}),
		tags: collection({
			label: "Tags",
			path: "./content/tags/*",
			slugField: "name",
			format: { data: "json" },
			previewUrl: createPreviewUrl("/tags/{slug}"),
			entryLayout: "form",
			columns: ["name"],
			schema: {
				name: fields.slug({
					name: {
						label: "Name",
						validation: { isRequired: true },
					},
				}),
				// description: fields.text({
				// 	label: "Description",
				// 	multiline: true,
				// 	validation: {isRequired: true },
				// }),
			},
		}),
		licenses: collection({
			label: "Licenses",
			path: "./content/licenses/*",
			slugField: "name",
			format: { data: "json" },
			previewUrl: createPreviewUrl("/licenses/{slug}"),
			entryLayout: "form",
			columns: ["name"],
			schema: {
				name: fields.slug({
					name: {
						label: "Name",
						validation: { isRequired: true },
					},
				}),
				url: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
		}),
		documentation: collection({
			label: "Documentation",
			path: "./content/documentation/**",
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/documentation/{slug}"),
			entryLayout: "content",
			columns: ["title", "publicationDate"],
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				summary: fields.text({
					label: "Summary",
					multiline: true,
					validation: { isRequired: true },
				}),
				locale: fields.select({
					label: "Language",
					options: locales.map((locale) => {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						return { label: localeLabel.of(locale)!, value: locale };
					}),
					defaultValue: defaultLocale,
				}),
				authors: fields.array(
					fields.relationship({
						collection: "people",
						label: "Author",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select an author";
						},
						label: "Authors",
						validation: { length: { min: 1 } },
					},
				),
				editors: fields.array(
					fields.relationship({
						collection: "people",
						label: "Editor",
						validation: { isRequired: true },
					}),
					{
						itemLabel(props) {
							return props.value ?? "Select an editor";
						},
						label: "Editors",
						// validation: { length: { min: 0 } },
					},
				),
				publicationDate: fields.date({
					label: "Publication date",
					defaultValue: { kind: "today" },
					validation: { isRequired: true },
				}),
				version: fields.text({
					label: "Version",
					defaultValue: "1.0.0",
					validation: { isRequired: true },
				}),
				license: fields.relationship({
					collection: "licenses",
					label: "License",
					validation: { isRequired: true },
				}),
				toc: fields.checkbox({
					label: "Display table of contents",
					defaultValue: true,
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						image: createAssetPaths("/content/documentation/"),
					},
					components: createComponents("/content/documentation/"),
				}),
			},
		}),
		// homePage: collection({
		// 	label: "Home page",
		// 	path: "./content/home-page/*",
		// 	slugField: "title",
		// 	format: { contentField: "content" },
		// 	previewUrl: createPreviewUrl("/{slug}"),
		// 	entryLayout: "content",
		//  columns: ["title"],
		// 	schema: {
		// 		title: fields.text({
		// 			label: "Title",
		// 			validation: { isRequired: true },
		// 		}),
		// 		content: fields.mdx({
		// 			label: "Content",
		// 			options: {
		// 				image: createAssetPaths("/content/home-page/"),
		// 			},
		// 			components: createComponents("/content/home-page/"),
		// 		}),
		// 	},
		// }),
	},
});
