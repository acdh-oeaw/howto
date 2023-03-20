import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { useSearchFieldState } from '@react-stately/searchfield'
import type { SearchFieldProps as AriaSearchFieldProps } from '@react-types/searchfield'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import AcademicCapIcon from '@/assets/icons/academic-cap.svg?symbol'
import DocumentIcon from '@/assets/icons/document-text.svg?symbol'
import LightningBoltIcon from '@/assets/icons/lightning-bolt.svg?symbol'
import MenuIcon from '@/assets/icons/menu.svg?symbol'
import SearchIcon from '@/assets/icons/search.svg?symbol'
import ClearIcon from '@/assets/icons/x.svg?symbol'
import { Icon } from '@/common/Icon'
import { ModalDialog } from '@/common/ModalDialog'
import { Spinner } from '@/common/Spinner'
import { useI18n } from '@/i18n/useI18n'
import { useLocale } from '@/i18n/useLocale'
import { navigation } from '@/navigation/navigation.config'
import { NavLink } from '@/navigation/NavLink'
import { routes } from '@/navigation/routes.config'
import type { SearchStatus } from '@/search/useSearch'
import { useSearch } from '@/search/useSearch'
import Logo from '~/public/assets/images/logo.svg'

/**
 * Page header.
 */
export function PageHeader(): JSX.Element {
  const { t } = useI18n()

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link
          aria-label={t('common.page.home')}
        className="inline-flex rounded transition focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
        href={navigation.home.href}
        >
        <Image src={Logo} alt="" height="40" width="36" priority />
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
    <nav className="hidden md:flex md:items-center md:space-x-8">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {Object.entries(navigation).map(([route, { href }]) => {
          return (
            <li key={route}>
              <NavLink
                className="rounded transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
                href={href}
              >
                  {t(`common.page.${route}`)}
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

  useEffect(() => {
    router.events.on('routeChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <nav className="flex items-center space-x-6 md:hidden">
      <Search />
      <LanguageSwitcher />
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="rounded transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
      >
        <Icon icon={MenuIcon} className="h-10 w-10 shrink-0 p-2" />
      </button>
      {dialogState.isOpen ? (
        <ModalDialog
          // TODO: use aria-label instead of title
          title={t('common.mainNavigationMenu')}
          isOpen
          onClose={dialogState.close}
          isDismissable
        >
          <div className="flex flex-col">
            <ul className="my-8 flex flex-col space-y-4 overflow-y-auto font-medium">
              {Object.entries(navigation).map(([route, { href }]) => {
                return (
                  <li key={route} className="flex p-2">
                    <NavLink
                      className="flex flex-1 items-center justify-center rounded py-2 transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
                      href={href}
                    >
                        {t(`common.page.${route}`)}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </ModalDialog>
      ) : null}
    </nav>
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
      className="h-10 w-10 rounded bg-neutral-800 text-xs font-medium text-neutral-100 transition hover:bg-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
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
  const [searchTerm, setSearchTerm] = useState('')
  const { data: searchResults, status } = useSearch(searchTerm)

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

  function onSubmit(searchTerm: string) {
    setSearchTerm(searchTerm.trim())
  }

  useEffect(() => {
    router.events.on('routeChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <div role="search" className="flex items-center">
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="rounded transition hover:text-brand-blue focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
      >
        <Icon icon={SearchIcon} className="h-10 w-10 shrink-0 p-2" />
      </button>
      {dialogState.isOpen ? (
        <ModalDialog
          // TODO: use aria-label instead of title
          title={t('common.search')}
          isOpen
          onClose={dialogState.close}
          isDismissable
        >
          <div className="flex flex-col space-y-4">
            <SearchField
              autoFocus
              label={t('common.search')}
              placeholder={t('common.search')}
              onSubmit={onSubmit}
              isDisabled={status === 'disabled'}
              loadingState={status}
              value={searchTerm}
              onChange={setSearchTerm}
            />
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <ul className="overflow-y-auto">
                {searchResults.map((result) => {
                  const href =
                    result.type === 'courses'
                      ? routes.course({ id: result.id })
                      : routes.resource({ kind: result.kind, id: result.id })

                  const icon = result.type === 'courses' ? AcademicCapIcon : DocumentIcon

                  return (
                    <li key={result.id}>
                      <article>
                        <Link
                          className="flex flex-col space-y-1 rounded p-2 transition hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100"
                          href={{ ...href, hash: result.heading?.id }}
                        >
                            <h3 className="flex items-center space-x-2 font-medium">
                            <Icon icon={icon} className="h-5 w-5 shrink-0" />
                              <span>{result.title}</span>
                            </h3>
                            {result._snippetResult?.content.value != null ? (
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: result._snippetResult.content.value,
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
                                      className="mb-1 mr-4 text-xs font-bold uppercase tracking-wide text-brand-blue"
                                      >
                                        {tag.name}
                                      </li>
                                    )
                                  })}
                                </ul>
                              </dd>
                            </dl>
                        </Link>
                      </article>
                    </li>
                  )
                })}
              </ul>
            ) : status === 'success' ? (
              <div className="py-4 text-center text-neutral-500">{t('common.noResultsFound')}</div>
            ) : null}
          </div>
        </ModalDialog>
      ) : null}
    </div>
  )
}

interface SearchFieldProps extends AriaSearchFieldProps {
  loadingState?: SearchStatus
}

/**
 * Search input field.
 */
function SearchField(props: SearchFieldProps) {
  const { label } = props
  const loadingState = props.loadingState ?? 'idle'

  const state = useSearchFieldState(props)
  const inputRef = useRef<HTMLInputElement>(null)
  const { labelProps, inputProps, clearButtonProps } = useSearchField(props, state, inputRef)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(clearButtonProps, buttonRef)

  return (
    <label {...labelProps} className="flex flex-col space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex space-x-4 rounded border border-neutral-200 px-4 py-2 focus-within:ring focus-within:ring-brand-blue">
        {loadingState === 'loading' ? (
          <Spinner className="h-5 w-5 shrink-0 text-brand-blue" />
        ) : loadingState === 'error' ? (
          <Icon icon={LightningBoltIcon} className="h-5 w-5 shrink-0 text-error-600" />
        ) : (
          <Icon icon={SearchIcon} className="h-5 w-5 shrink-0" />
        )}
        <input {...inputProps} ref={inputRef} className="min-w-0 flex-1 focus:outline-none" />
        {state.value !== '' ? (
          <button {...buttonProps} ref={buttonRef}>
            <Icon icon={ClearIcon} className="h-5 w-5 shrink-0" />
          </button>
        ) : null}
      </div>
    </label>
  )
}
