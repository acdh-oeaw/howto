import type { Hit } from '@algolia/client-search'
import { useButton } from '@react-aria/button'
import { useDialog } from '@react-aria/dialog'
import { FocusScope } from '@react-aria/focus'
import type { OverlayProps as AriaOverlayProps } from '@react-aria/overlays'
import {
  OverlayContainer,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays'
import { useSearchField } from '@react-aria/searchfield'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { useSearchFieldState } from '@react-stately/searchfield'
import type { SearchFieldProps as AriaSearchFieldProps } from '@react-types/searchfield'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useState, Fragment, useEffect, useRef } from 'react'

import { Svg as AcademicCapIcon } from '@/assets/icons/academic-cap.svg'
import { Svg as DocumentIcon } from '@/assets/icons/document-text.svg'
import { Svg as MenuIcon } from '@/assets/icons/menu.svg'
import { Svg as SearchIcon } from '@/assets/icons/search.svg'
import { Svg as ClearIcon } from '@/assets/icons/x.svg'
import { Icon } from '@/common/Icon'
import { useI18n } from '@/i18n/useI18n'
import { useLocale } from '@/i18n/useLocale'
import { navigation } from '@/navigation/navigation.config'
import { NavLink } from '@/navigation/NavLink'
import { routes } from '@/navigation/routes.config'
import { getAlgoliaSearchIndex } from '@/search/getAlgoliaSearchIndex'
import type { IndexedCourse, IndexedResource } from '@/search/types'

/**
 * Page header.
 */
export function PageHeader(): JSX.Element {
  const { t } = useI18n()

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link href={navigation.home.href}>
        <a aria-label={t('common.page.home')}>
          <Image
            src="/assets/images/logo.svg"
            alt=""
            className="inline-block h-10"
            height="40"
            width="36"
            layout="fixed"
            priority
          />
        </a>
      </Link>
      <PageNavigation />
      <MobilePageNavigation />
    </header>
  )
}

/**
 * Main page navigation.
 */
function PageNavigation() {
  const { t } = useI18n()

  return (
    <nav className="hidden sm:items-center sm:space-x-8 sm:flex">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {Object.entries(navigation).map(([route, { href }]) => {
          return (
            <li key={route}>
              <NavLink href={href}>
                <a>{t(`common.page.${route}`)}</a>
              </NavLink>
            </li>
          )
        })}
      </ul>
      <Search />
      <LanguageSwitcher />
    </nav>
  )
}

/**
 * Mobile main page navigation.
 */
function MobilePageNavigation() {
  const { t } = useI18n()
  const router = useRouter()

  const dialogState = useOverlayTriggerState({})

  const openButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: openButtonProps } = useButton(
    {
      'aria-label': t('common.openMainNavigationMenu'),
      onPress() {
        dialogState.open()
      },
    },
    openButtonRef,
  )

  // const closeButtonRef = useRef<HTMLButtonElement>(null)
  // const { buttonProps: closeButtonProps } = useButton(
  //   {
  //     onPress() {
  //       dialogState.close()
  //     },
  //   },
  //   closeButtonRef,
  // )

  useEffect(() => {
    router.events.on('routeChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <nav className="flex items-center space-x-8 sm:hidden">
      <Search />
      <LanguageSwitcher />
      <button {...openButtonProps} ref={openButtonRef}>
        <Icon icon={MenuIcon} className="flex-shrink-0 w-6 h-6" />
      </button>
      {dialogState.isOpen ? (
        <OverlayContainer>
          <ModalDialog
            // TODO: use aria-label instead of title
            // If a dialog does not have a visible title element, an aria-label or aria-labelledby prop must be passed instead to identify the element to assistive technology.
            title={t('common.mainNavigationMenu')}
            isOpen
            onClose={dialogState.close}
            isDismissable
          >
            <div>
              <ul className="flex flex-col items-center space-y-8 font-medium">
                {Object.entries(navigation).map(([route, { href }]) => {
                  return (
                    <li key={route}>
                      <NavLink href={href}>
                        <a>{t(`common.page.${route}`)}</a>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          </ModalDialog>
        </OverlayContainer>
      ) : null}
    </nav>
  )
}

interface ModalDialogProps extends AriaOverlayProps {
  title: string
  children: ReactNode
}

/**
 * Modal dialog.
 */
function ModalDialog(props: ModalDialogProps) {
  const { title, children } = props

  const overlayRef = useRef<HTMLDivElement>(null)
  const { overlayProps, underlayProps } = useOverlay(props, overlayRef)

  usePreventScroll()
  const { modalProps } = useModal()

  const { dialogProps, titleProps } = useDialog({}, overlayRef)

  return (
    <div
      {...underlayProps}
      className="fixed inset-0 z-10 flex flex-col items-center justify-start bg-black bg-opacity-50"
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          className="flex flex-col p-8 bg-white rounded"
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={overlayRef}
        >
          <h2 {...titleProps} className="sr-only">
            {title}
          </h2>
          {children}
        </div>
      </FocusScope>
    </div>
  )
}

/**
 * Toggles UI language.
 */
function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const { t } = useI18n()

  const languageAlternate = locale === 'de' ? 'en' : 'de'

  function toggleLocale() {
    setLocale(languageAlternate)
  }

  return (
    <button
      onClick={toggleLocale}
      className="p-1.5 text-neutral-100 rounded focus:outline-none bg-neutral-800 text-xs font-medium hover:bg-neutral-700 transition"
    >
      <span className="sr-only">
        {t('common.switchLanguage', {
          language: t(`common.language.${languageAlternate}`),
        })}
      </span>
      <span className="uppercase">{languageAlternate}</span>
    </button>
  )
}

/**
 * Search button and dialog.
 */
function Search() {
  const { t } = useI18n()
  const router = useRouter()

  const dialogState = useOverlayTriggerState({})
  const [searchIndex] = useState(() => getAlgoliaSearchIndex())
  const [searchResults, setSearchResults] = useState<
    Array<Hit<IndexedResource | IndexedCourse>>
  >([])

  const openButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: openButtonProps } = useButton(
    {
      'aria-label': t('common.search'),
      onPress() {
        dialogState.open()
      },
    },
    openButtonRef,
  )

  // const closeButtonRef = useRef<HTMLButtonElement>(null)
  // const { buttonProps: closeButtonProps } = useButton(
  //   {
  //     onPress() {
  //       dialogState.close()
  //     },
  //   },
  //   closeButtonRef,
  // )

  function onSubmit(searchTerm: string) {
    let wasCanceled = false

    async function search() {
      if (searchTerm.trim().length === 0) return

      if (searchIndex == null) return
      const results = await searchIndex.search<IndexedResource | IndexedCourse>(
        searchTerm,
        {
          hitsPerPage: 10,
          attributesToRetrieve: ['type', 'kind', 'id', 'title', 'tags'],
          attributesToHighlight: ['title'],
          attributesToSnippet: ['abstract', 'body'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          snippetEllipsisText: '&hellip;',
        },
      )

      if (!wasCanceled) {
        setSearchResults(results.hits)
      }
    }

    search()

    return () => {
      wasCanceled = true
    }
  }

  useEffect(() => {
    router.events.on('routeChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <Fragment>
      <button {...openButtonProps} ref={openButtonRef}>
        <Icon icon={SearchIcon} className="flex-shrink-0 w-6 h-6" />
      </button>
      {dialogState.isOpen ? (
        <OverlayContainer>
          <ModalDialog
            // TODO: use aria-label instead of title
            // If a dialog does not have a visible title element, an aria-label or aria-labelledby prop must be passed instead to identify the element to assistive technology.
            title={t('common.search')}
            isOpen
            onClose={dialogState.close}
            isDismissable
          >
            <div className="space-y-4">
              <SearchField
                label={t('common.search')}
                placeholder={t('common.search')}
                onSubmit={onSubmit}
                isDisabled={searchIndex == null}
              />
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => {
                    const href =
                      result.type === 'courses'
                        ? routes.course({ id: result.id })
                        : routes.resource({ kind: result.kind, id: result.id })

                    const icon =
                      result.type === 'courses' ? AcademicCapIcon : DocumentIcon

                    return (
                      <li key={result.id}>
                        <article>
                          <Link href={href}>
                            <a className="flex flex-col px-2 py-2 space-y-1 transition rounded hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100">
                              <h3 className="flex items-center space-x-2 font-medium">
                                <Icon icon={icon} className="w-5 h-5" />
                                <span>{result.title}</span>
                              </h3>
                              {result._snippetResult?.abstract.value != null ? (
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      result._snippetResult.abstract.value,
                                  }}
                                />
                              ) : result._snippetResult?.body.value != null ? (
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: result._snippetResult.body.value,
                                  }}
                                />
                              ) : null}
                              <dl>
                                <dt className="sr-only">{t('common.tags')}</dt>
                                <dd className="my-px">
                                  <ul className="flex flex-wrap">
                                    {result.tags.map((tag) => {
                                      return (
                                        <li
                                          key={tag.id}
                                          className="mb-1 mr-4 text-xs font-bold tracking-wide uppercase text-primary-600"
                                        >
                                          {tag.name}
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </dd>
                              </dl>
                            </a>
                          </Link>
                        </article>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="py-4 text-center text-neutral-500">
                  {t('common.noResultsFound')}
                </div>
              )}
            </div>
          </ModalDialog>
        </OverlayContainer>
      ) : null}
    </Fragment>
  )
}

type SearchFieldProps = AriaSearchFieldProps

/**
 * Search input field.
 */
function SearchField(props: SearchFieldProps) {
  const { label } = props

  const state = useSearchFieldState(props)
  const inputRef = useRef<HTMLInputElement>(null)
  const { labelProps, inputProps, clearButtonProps } = useSearchField(
    props,
    state,
    inputRef,
  )
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(clearButtonProps, buttonRef)

  return (
    <label {...labelProps} className="flex flex-col space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex px-4 py-2 border rounded border-neutral-200">
        <input {...inputProps} ref={inputRef} className="flex-1 min-w-0" />
        {state.value !== '' ? (
          <button {...buttonProps} ref={buttonRef}>
            <Icon icon={ClearIcon} className="flex-shrink-0 w-5 h-5" />
          </button>
        ) : null}
      </div>
    </label>
  )
}
