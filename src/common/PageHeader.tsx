import { useButton } from '@react-aria/button'
import { useDialog } from '@react-aria/dialog'
import { FocusScope } from '@react-aria/focus'
import type { OverlayProps } from '@react-aria/overlays'
import {
  OverlayContainer,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { Svg as MenuIcon } from '@/assets/icons/menu.svg'
import { Icon } from '@/common/Icon'
import { useI18n } from '@/i18n/useI18n'
import { useLocale } from '@/i18n/useLocale'
import { navigation } from '@/navigation/navigation.config'
import { NavLink } from '@/navigation/NavLink'

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
      <LanguageSwitcher />
      <button
        aria-label={t('common.openMainNavigationMenu')}
        {...openButtonProps}
        ref={openButtonRef}
      >
        <Icon icon={MenuIcon} className="w-6 h-6" />
      </button>
      {dialogState.isOpen ? (
        <OverlayContainer>
          <ModalDialog
            title={t('common.mainNavigationMenu')}
            isOpen
            onClose={dialogState.close}
            isDismissable
          >
            <div>
              <ul
                className="flex flex-col items-center space-y-8 font-medium"
                style={{ minWidth: '60vw' }}
              >
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

interface ModalDialogProps extends OverlayProps {
  title: string
  children: ReactNode
}

/**
 * Modal dialog.
 */
function ModalDialog(props: ModalDialogProps) {
  const { title, children } = props

  const overlayRef = useRef(null)
  const { overlayProps, underlayProps } = useOverlay(props, overlayRef)

  usePreventScroll()
  const { modalProps } = useModal()

  const { dialogProps, titleProps } = useDialog({}, overlayRef)

  return (
    <div
      {...underlayProps}
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          className="p-8 bg-white rounded"
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
