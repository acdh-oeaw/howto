import { useId } from '@react-aria/utils'
import cx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { Children, Fragment, isValidElement, useState } from 'react'

export interface TabProps {
  title: string
  children?: ReactNode
}

export function Tab(props: TabProps): JSX.Element {
  return <Fragment>{props.children}</Fragment>
}

Tab.isTab = true

export interface TabsProps {
  children: Array<ReactElement<TabProps>>
}

export function Tabs(props: TabsProps): JSX.Element {
  const tabs = Children.toArray(props.children)
    .filter(isValidElement)
    .filter((child): child is ReactElement<TabProps> => {
      return typeof child.type !== 'string' && 'isTab' in child.type
    })
  const [activeTab, setActiveTab] = useState(0)
  const id = useId()

  const currentTab = tabs[activeTab]
  const currentTabId = id + activeTab
  const currentTabPanelId = id + activeTab + 'panel'

  return (
    <Fragment>
      <div className="not-prose mt-4 mb-6">
        <ul className="flex gap-12" role="tablist">
          {tabs.map((tab, index) => {
            const title = tab.props.title
            if (typeof title !== 'string' || title.length === 0) return null

            function setTabAsActiveTab() {
              setActiveTab(index)
            }

            return (
              <li className="tab-button" key={index}>
                <button
                  role="tab"
                  id={id + index}
                  aria-controls={id + index + 'panel'}
                  aria-selected={activeTab === index}
                  className={cx(
                    'py-1',
                    activeTab === index ? 'border-b border-current' : 'opacity-50',
                  )}
                  onClick={setTabAsActiveTab}
                >
                  {title}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="border-b border-current opacity-10" />
      </div>
      <div
        className="tabpanel"
        id={currentTabPanelId}
        role="tabpanel"
        aria-labelledby={currentTabId}
      >
        {currentTab}
      </div>
    </Fragment>
  )
}

Tabs.Tab = Tab
