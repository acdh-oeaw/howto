import { useButton } from '@react-aria/button'
import { useOverlayTriggerState } from '@react-stately/overlays'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

import { Svg as TocIcon } from '@/assets/icons/toc.svg'
import { Icon } from '@/common/Icon'
import { ModalDialog } from '@/common/ModalDialog'
import { useI18n } from '@/i18n/useI18n'
import { TableOfContents } from '@/views/TableOfContents'

export interface FloatingTableOfContentsProps {
  toc: Toc
}

/**
 * Floating button which opens a table of contents dialog.
 */
export function FloatingTableOfContents(
  props: FloatingTableOfContentsProps,
): JSX.Element {
  const { toc } = props

  const { t } = useI18n()
  const router = useRouter()

  const dialogState = useOverlayTriggerState({})

  const openButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: openButtonProps } = useButton(
    {
      'aria-label': t('common.openTableOfContents'),
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
    router.events.on('hashChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
      router.events.off('hashChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <nav aria-label={t('common.tableOfContents')}>
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="fixed flex items-center justify-center w-12 h-12 text-white rounded-full bg-primary-600 right-6 bottom-6"
      >
        <Icon icon={TocIcon} className="w-10 h-10 p-2" />
      </button>
      {dialogState.isOpen ? (
        <ModalDialog
          title={t('common.tableOfContents')}
          isOpen
          onClose={dialogState.close}
          isDismissable
        >
          <TableOfContents toc={toc} className="w-full space-y-2" />
          {/* <TableOfContentsLevel headings={toc} className="w-full space-y-2" /> */}
        </ModalDialog>
      ) : null}
    </nav>
  )
}
