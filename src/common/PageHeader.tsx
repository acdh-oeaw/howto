import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { useSearchFieldState } from '@react-stately/searchfield'
import type { SearchFieldProps as AriaSearchFieldProps } from '@react-types/searchfield'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

import { Svg as AcademicCapIcon } from '@/assets/icons/academic-cap.svg'
import { Svg as DocumentIcon } from '@/assets/icons/document-text.svg'
import { Svg as LightningBoltIcon } from '@/assets/icons/lightning-bolt.svg'
import { Svg as MenuIcon } from '@/assets/icons/menu.svg'
import { Svg as SearchIcon } from '@/assets/icons/search.svg'
import { Svg as ClearIcon } from '@/assets/icons/x.svg'
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
import Logo from '~/public/assets/images/logo-tinted.svg'

/**
 * Page header.
 */
export function PageHeader(): JSX.Element {
  const { t } = useI18n()

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link href={navigation.home.href}>
        <a
          aria-label={t('common.page.home')}
          className="inline-flex transition rounded focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
        >
          <Image
            src={Logo}
            alt=""
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
    <nav className="hidden md:items-center md:space-x-8 md:flex">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {Object.entries(navigation).map(([route, { href }]) => {
          return (
            <li key={route}>
              <NavLink href={href}>
                <a className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                  {t(`common.page.${route}`)}
                </a>
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
        className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        <Icon icon={MenuIcon} className="flex-shrink-0 w-10 h-10 p-2" />
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
            <ul className="flex flex-col my-8 space-y-4 overflow-y-auto font-medium">
              {Object.entries(navigation).map(([route, { href }]) => {
                return (
                  <li key={route} className="flex px-2 py-2">
                    <NavLink href={href}>
                      <a className="flex items-center justify-center flex-1 py-2 transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                        {t(`common.page.${route}`)}
                      </a>
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
      className="w-10 h-10 text-xs font-medium transition rounded text-neutral-100 focus:outline-none bg-neutral-800 hover:bg-primary-600 focus-visible:ring focus-visible:ring-primary-600"
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
        className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        <Icon icon={SearchIcon} className="flex-shrink-0 w-10 h-10 p-2" />
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

                  const icon =
                    result.type === 'courses' ? AcademicCapIcon : DocumentIcon

                  return (
                    <li key={result.id}>
                      <article>
                        <Link href={{ ...href, hash: result.heading?.id }}>
                          <a className="flex flex-col px-2 py-2 space-y-1 transition rounded hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100">
                            <h3 className="flex items-center space-x-2 font-medium">
                              <Icon
                                icon={icon}
                                className="flex-shrink-0 w-5 h-5"
                              />
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
            ) : searchTerm.length > 0 ? (
              <div className="py-4 text-center text-neutral-500">
                {t('common.noResultsFound')}
              </div>
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
      <div className="flex px-4 py-2 space-x-4 border rounded border-neutral-200 focus-within:ring-primary-600 focus-within:ring">
        {loadingState === 'loading' ? (
          <Spinner className="flex-shrink-0 w-5 h-5 text-primary-600" />
        ) : loadingState === 'error' ? (
          <Icon
            icon={LightningBoltIcon}
            className="flex-shrink-0 w-5 h-5 text-error-600"
          />
        ) : (
          <Icon icon={SearchIcon} className="flex-shrink-0 w-5 h-5" />
        )}
        <input
          {...inputProps}
          ref={inputRef}
          className="flex-1 min-w-0 focus:outline-none"
        />
        {state.value !== '' ? (
          <button {...buttonProps} ref={buttonRef}>
            <Icon icon={ClearIcon} className="flex-shrink-0 w-5 h-5" />
          </button>
        ) : null}
      </div>
    </label>
  )
}
