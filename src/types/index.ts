import { ComputedRef } from "vue";

export type Preview = {
  src: string;
  imageStyle: Record<string, string | number>;
  containerStyle: Record<string, string | number>;
};

export type CardOption = {
  /**卡片背景色 */
  backgroundColor?: string;
  /**卡片背景图片 */
  backgroundImage?: string | Blob;
  /**卡片上的渐变色 */
  gradientColor?: string;
  /**渐变起始位置% */
  gradientStart?: string;
  /**渐变结束位置% */
  gradientEnd?: string;
  /**用户名 */
  nickname?: string;
  /**头像 */
  avatar?: string | Blob;
  /**粉丝编号 */
  fansNo?: string;
  /**获得装扮日期 */
  date?: string;
  /**自定义链接 */
  customLink?: string;
  /**分享文案 */
  article?: ComputedRef<string>;
  /**主播名 */
  anchorName?: string;
};

// export type CardConfig = {};
