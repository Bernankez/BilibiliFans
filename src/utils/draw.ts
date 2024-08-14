import { resolveImage } from "./cache";
import { create, getContext } from "./canvas";
import { isWebWorker } from "./is";
import KenneyMini from "@/assets/font/Kenney-Mini-Square.ttf";

export interface RawDrawOptions {
  // font size should be inferred from width
  width: number;
  height: number;
  avatar: string;
  nickname: string;
  no: number;
  date: string;
  color: string;
  background: {
    image: string;
    // x,y
    origin?: [number, number];
    // w,h
    size?: [number, number];
    color?: string;
  };
  foreground?: {
    color: string;
    gradient?: {
      leftStart?: number;
      leftEnd?: number;
      rightStart?: number;
      rightEnd?: number;
    };
  };
}

export type DrawOptions = Awaited<ReturnType<typeof resolveOptions>>;

export async function resolveOptions(options: RawDrawOptions) {
  const { width, background } = options;
  const { image } = background;

  const backgroundImage = await resolveImage(image);
  const avatarImage = await resolveImage(options.avatar);

  const fontSize = width / 30.375;
  const padding = {
    top: 0.875 * fontSize,
    right: 1.125 * fontSize,
    bottom: 0.4375 * fontSize,
    left: 1.125 * fontSize,
  };
  const avatar = {
    image: avatarImage,
    width: 1.9375 * fontSize,
    height: 1.9375 * fontSize,
    outline: {
      color: "#fff",
      width: 0.0625 * fontSize,
    },
    x: padding.left,
    y: padding.top,
  };
  const nickname = {
    text: options.nickname,
    fontSize: 1.125 * fontSize,
    x: padding.left + avatar.width + 0.8 * fontSize,
    y: padding.top + 1.1 * fontSize,
  };
  const no = {
    title: {
      text: "FANS NO.",
      fontSize: 1 * fontSize,
      x: padding.left,
      y: padding.top + 4.1 * fontSize,
    },
    number: {
      text: options.no.toString().padStart(6, "0"),
      fontSize: 1.8125 * fontSize,
      letterSpacing: 0.0625 * fontSize,
      x: padding.left,
      y: padding.top + 5.75 * fontSize,
    },
  };
  const date = {
    title: {
      text: "DATE",
      fontSize: 1 * fontSize,
      x: padding.left,
      y: padding.top + 8.6 * fontSize,
    },
    date: {
      text: options.date,
      fontSize: 1 * fontSize,
      letterSpacing: 0.04 * fontSize,
      x: padding.left,
      y: padding.top + 10 * fontSize,
    },
  };

  return {
    ...options,
    fontSize,
    borderRadius: fontSize * 0.375,
    font: {
      normal: {
        fontFamily: "Avenir, system-ui, -apple-system, \"Segoe UI\", Roboto, Emoji, Helvetica, Arial, sans-serif",
      },
      mono: {
        fontFamily: "\"Google Sans Text\", Arial, Helvetica, sans-serif",
        opacity: 0.5,
      },
      kenney: {
        fontFamily: "kenney mini",
      },
    },
    padding,
    avatar,
    nickname,
    no,
    date,
    background: {
      ...background,
      image: backgroundImage,
    },
  };
}

export async function loadFont() {
  const kenney = "kenney mini";
  const _isWebWorker = isWebWorker();
  const fonts = _isWebWorker ? globalThis.fonts : document.fonts;
  for (const font of fonts) {
    if (font.family === kenney) {
      return;
    }
  }
  let font: FontFace;
  if (_isWebWorker) {
    const response = await fetch(KenneyMini);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    font = new FontFace(kenney, buffer);
  } else {
    font = new FontFace(kenney, KenneyMini);
  }
  await font.load();
  fonts.add(font);
}

export async function render(options: RawDrawOptions, canvas?: HTMLCanvasElement | OffscreenCanvas) {
  const drawOptions = await resolveOptions(options);
  await loadFont();
  const { width, height, background, foreground } = drawOptions;
  const { image, origin = [0, 0], size = [width, height], color: backgroundColor } = background;
  const _canvas = canvas || create(width, height);
  const ctx = getContext(_canvas);
  clipBackground(ctx, drawOptions);
  if (backgroundColor) {
    // Background color
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.restore();
  }
  // Background image
  ctx.drawImage(image, origin[0], origin[1], size[0], size[1], 0, 0, width, height);
  if (foreground) {
    drawForeground(ctx, drawOptions);
  }
  drawUser(ctx, drawOptions);
  drawFansNo(ctx, drawOptions);
  drawDate(ctx, drawOptions);
  return _canvas;
}

export function clipBackground(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { width, height, borderRadius } = options;
  ctx.beginPath();
  ctx.moveTo(borderRadius, 0);
  ctx.lineTo(width - borderRadius, 0);
  ctx.quadraticCurveTo(width, 0, width, borderRadius);
  ctx.lineTo(width, height - borderRadius);
  ctx.quadraticCurveTo(width, height, width - borderRadius, height);
  ctx.lineTo(borderRadius, height);
  ctx.quadraticCurveTo(0, height, 0, height - borderRadius);
  ctx.lineTo(0, borderRadius);
  ctx.quadraticCurveTo(0, 0, borderRadius, 0);
  ctx.closePath();
  ctx.clip();
}

export function drawForeground(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { width, height, foreground } = options;
  if (foreground) {
    const { color, gradient } = foreground || {};
    const { leftStart = 0, leftEnd = 0, rightStart = 0, rightEnd = 0 } = gradient || {};

    ctx.save();
    const gradientLeft = ctx.createLinearGradient(0, 0, width, 0);
    gradientLeft.addColorStop(0, color);
    gradientLeft.addColorStop(leftStart, color);
    gradientLeft.addColorStop(leftEnd, "#ffffff00");
    gradientLeft.addColorStop(1, "#ffffff00");
    ctx.fillStyle = gradientLeft;
    ctx.fillRect(0, 0, width, height);

    const gradientRight = ctx.createLinearGradient(width, 0, 0, 0);
    gradientRight.addColorStop(0, color);
    gradientRight.addColorStop(rightStart, color);
    gradientRight.addColorStop(rightEnd, "#ffffff00");
    gradientRight.addColorStop(1, "#ffffff00");
    ctx.fillStyle = gradientRight;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

export function drawUser(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { color, padding, avatar, nickname, font } = options;
  const { outline } = avatar;
  // outline
  ctx.save();
  ctx.beginPath();
  ctx.arc(padding.left + avatar.width / 2, padding.top + avatar.height / 2, avatar.width / 2 + outline.width, 0, Math.PI * 2);
  ctx.strokeStyle = outline.color;
  ctx.lineWidth = outline.width;
  ctx.stroke();
  ctx.restore();
  // avatar
  ctx.save();
  ctx.beginPath();
  ctx.arc(padding.left + avatar.width / 2, padding.top + avatar.height / 2, avatar.width / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatar.image, padding.left, padding.top, avatar.width, avatar.height);
  ctx.restore();
  // nickname
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${nickname.fontSize}px ${font.normal.fontFamily}`;
  ctx.textBaseline = "top";
  ctx.fillText(nickname.text, nickname.x, nickname.y);
  ctx.restore();
}

export function drawFansNo(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { no, color, font } = options;
  const { title, number } = no;
  // FANS NO.
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${title.fontSize}px ${font.mono.fontFamily}`;
  ctx.globalAlpha = font.mono.opacity;
  ctx.textBaseline = "top";
  ctx.fillText(title.text, title.x, title.y);
  ctx.restore();
  // number
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${number.fontSize}px ${font.kenney.fontFamily}`;
  ctx.textBaseline = "top";
  ctx.letterSpacing = `${number.letterSpacing}px`;
  ctx.fillText(number.text, number.x, number.y);
  ctx.restore();
}

export function drawDate(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { date, color, font } = options;
  const { title, date: dateText } = date;
  // DATE
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${title.fontSize}px ${font.mono.fontFamily}`;
  ctx.globalAlpha = font.mono.opacity;
  ctx.textBaseline = "top";
  ctx.fillText(title.text, title.x, title.y);
  ctx.restore();
  // date
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${dateText.fontSize}px ${font.normal.fontFamily}`;
  ctx.textBaseline = "top";
  ctx.letterSpacing = `${dateText.letterSpacing}px`;
  ctx.fillText(dateText.text, dateText.x, dateText.y);
  ctx.restore();
}
