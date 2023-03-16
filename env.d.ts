declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL?: string
      GITHUB_ID?: string
      GITHUB_SECRET?: string
      NEXT_PUBLIC_GIT_REPO?: string
      NEXT_PUBLIC_GIT_BRANCH?: string
      NEXT_PUBLIC_MATOMO_BASE_URL?: string
      NEXT_PUBLIC_MATOMO_ID?: string
      NEXT_PUBLIC_LOCAL_CMS_URL?: string
      NEXT_PUBLIC_ALGOLIA_APP_ID?: string
      NEXT_PUBLIC_ALGOLIA_API_KEY?: string
      NEXT_PUBLIC_ALGOLIA_INDEX_NAME?: string
      ALGOLIA_ADMIN_API_KEY?: string
    }
  }
}

export {}
