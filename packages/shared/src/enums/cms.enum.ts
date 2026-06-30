/** نوع محتوا */
export enum ContentType {
  PAGE = 'page',
  ARTICLE = 'article',
  NEWS = 'news',
  FAQ = 'faq',
  BANNER = 'banner',
  GALLERY = 'gallery',
  TESTIMONIAL = 'testimonial',
}

/** وضعیت انتشار */
export enum PublishStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/** نوع بنر */
export enum BannerType {
  HERO = 'hero',
  SIDEBAR = 'sidebar',
  POPUP = 'popup',
  INLINE = 'inline',
}
