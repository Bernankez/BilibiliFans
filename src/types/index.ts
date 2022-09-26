import type { ComputedRef } from "vue";

export interface Preview {
  src: string
  imageStyle: Record<string, string | number>
  containerStyle: Record<string, string | number>
}

export interface CardOption {
  /** 卡片背景色 */
  backgroundColor?: string
  /** 卡片背景图片 */
  backgroundImage?: string | Blob
  /** 是否使用前景渐变色 */
  gradient?: boolean
  /** 卡片上的渐变色 */
  gradientColor?: string
  /** 渐变起始位置% */
  gradientStart?: string
  /** 渐变结束位置% */
  gradientEnd?: string
  /** 用户名 */
  nickname?: string
  /** 头像 */
  avatar?: string | Blob
  /** 粉丝编号 */
  fansNo?: string
  /** 获得装扮日期 */
  date?: string
  /** 自定义链接 */
  customLink?: string
  /** 分享文案 */
  article?: ComputedRef<string>
  /** 主播名 */
  anchorName?: string
  /** 字体颜色 */
  textColor?: string
  /** 框选范围限制在图片内 */
  boxInsideImage?: boolean
  /** 允许图片缩放 */
  imageScale?: boolean
  /** 允许图片拖动 */
  imageMove?: boolean
}
