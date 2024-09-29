import KenneyMini from "@/assets/font/Kenney-Mini-Square.ttf";
import { isDefined } from "@bernankez/utils";
import Compressor from "compressorjs";
import type { User } from "@/types/user";
import { resolveImage } from "./cache";
import { create, getContext } from "./canvas";
import { isWebWorker } from "./is";

export interface RawDrawOptions {
  width: number;
  height: number;
  template?: {
    cardStyle: {
      color?: string;
      foreground?: {
        gradient: {
          [K in "left" | "right"]?: {
            start: number;
            end: number;
            color: string;
          };
        };
      };
      background?: {
        image?: string | Blob;
        origin?: [number, number];
        size?: [number, number];
        color?: string;
      };
    };
  };
  user?: Partial<User>;
}

export interface DrawOptions {
  width: number;
  height: number;
  fontSize: number;
  cardStyle: {
    color: string;
    borderRadius: number;
    font: {
      normal: {
        fontFamily: string;
      };
      mono: {
        fontFamily: string;
        opacity: number;
      };
      kenney: {
        fontFamily: string;
      };
    };
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    foreground?: {
      gradient: {
        [K in "left" | "right"]?: {
          color: string;
          start: number;
          end: number;
        };
      };
    };
    background?: {
      image?: ImageBitmap | HTMLImageElement;
      origin: [number, number];
      size: [number, number];
      color?: string;
    };
  };
  user: {
    nickname?: {
      text: string;
      style: {
        fontSize: number;
        x: number;
        y: number;
      };
    };
    avatar?: {
      image: ImageBitmap | HTMLImageElement;
      style: {
        width: number;
        height: number;
        outline: {
          color: string;
          width: number;
        };
        x: number;
        y: number;
      };
    };
    no: {
      title: {
        text: string;
        style: {
          fontSize: number;
          x: number;
          y: number;
        };
      };
      number?: {
        text: string;
        style: {
          fontSize: number;
          letterSpacing: number;
          x: number;
          y: number;
        };
      };
    };
    date: {
      title: {
        text: string;
        style: {
          fontSize: number;
          x: number;
          y: number;
        };
      };
      date?: {
        text: string;
        style: {
          fontSize: number;
          letterSpacing: number;
          x: number;
          y: number;
        };
      };
    };
  };
}

export async function resolveOptions(options: RawDrawOptions): Promise<DrawOptions> {
  const { template, user, width, height } = options;
  const { cardStyle } = template || {};
  const { background } = cardStyle || {};

  const backgroundImage = background && await resolveImage(background.image);
  const avatarImage = user && await resolveImage(user.avatar);

  const fontSize = width / 30.375;
  const padding: DrawOptions["cardStyle"]["padding"] = {
    top: 0.875 * fontSize,
    right: 1.125 * fontSize,
    bottom: 0.4375 * fontSize,
    left: 1.125 * fontSize,
  };
  const _avatarStyle = {
    width: 1.9375 * fontSize,
    height: 1.9375 * fontSize,
    outline: {
      color: "#fff",
      width: 0.0625 * fontSize,
    },
    x: padding.left,
    y: padding.top,
  };
  const avatar: DrawOptions["user"]["avatar"] = avatarImage
    ? {
        image: avatarImage,
        style: _avatarStyle,
      }
    : undefined;
  const nickname: DrawOptions["user"]["nickname"] = user?.nickname
    ? {
        text: user.nickname,
        style: {
          fontSize: 1.125 * fontSize,
          x: padding.left + _avatarStyle.width + 0.8 * fontSize,
          y: padding.top + 1.87 * fontSize,
        },
      }
    : undefined;
  const no: DrawOptions["user"]["no"] = {
    title: {
      text: "FANS NO.",
      style: {
        fontSize: 1 * fontSize,
        x: padding.left,
        y: padding.top + 4.825 * fontSize,
      },
    },
    number: isDefined(user?.no)
      ? {
          text: user.no.toString().padStart(6, "0"),
          style: {
            fontSize: 1.8125 * fontSize,
            letterSpacing: 0.0625 * fontSize,
            x: padding.left,
            y: padding.top + 7.15 * fontSize,
          },
        }
      : undefined,
  };
  const date: DrawOptions["user"]["date"] = {
    title: {
      text: "DATE",
      style: {
        fontSize: 1 * fontSize,
        x: padding.left,
        y: padding.top + 9.35 * fontSize,
      },
    },
    date: isDefined(user?.date)
      ? {
          text: user.date,
          style: {
            fontSize: 1 * fontSize,
            letterSpacing: 0.04 * fontSize,
            x: padding.left,
            y: padding.top + 10.725 * fontSize,
          },
        }
      : undefined,
  };

  return {
    width,
    height,
    fontSize,
    cardStyle: {
      color: cardStyle?.color || "#ffffff",
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
      foreground: cardStyle?.foreground,
      background: {
        image: backgroundImage,
        origin: background?.origin || [0, 0],
        size: background?.size || [width, height],
        color: background?.color,
      },
    },
    user: {
      avatar,
      nickname,
      no,
      date,
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
  const { width, height, cardStyle } = drawOptions;
  const _canvas = canvas || create(width, height);
  const ctx = getContext(_canvas);
  clipBackground(ctx, drawOptions);
  if (cardStyle.background) {
    const { image, origin, size, color: backgroundColor } = cardStyle.background;
    if (backgroundColor) {
      // Background color
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.restore();
    }
    // Background image
    if (image) {
      ctx.drawImage(image, origin[0], origin[1], size[0], size[1], 0, 0, width, height);
    }
  }
  if (cardStyle.foreground) {
    drawForeground(ctx, drawOptions);
  }
  drawUser(ctx, drawOptions);
  drawFansNo(ctx, drawOptions);
  drawDate(ctx, drawOptions);
  return _canvas;
}

export function clipBackground(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { width, height, cardStyle } = options;
  const { borderRadius } = cardStyle;
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
  const { width, height, cardStyle } = options;
  if (cardStyle.foreground) {
    const { gradient } = cardStyle.foreground || {};
    const { left, right } = gradient || {};

    ctx.save();
    if (left) {
      const { color, start, end } = left;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(start, color);
      gradient.addColorStop(end, "#ffffff00");
      gradient.addColorStop(1, "#ffffff00");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    if (right) {
      const { color, start, end } = right;
      const gradient = ctx.createLinearGradient(width, 0, 0, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(start, color);
      gradient.addColorStop(end, "#ffffff00");
      gradient.addColorStop(1, "#ffffff00");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }
}

export function drawUser(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { cardStyle, user } = options;
  const { color, padding, font } = cardStyle;
  const { avatar, nickname } = user;
  if (avatar) {
    const { outline } = avatar.style;
    // outline
    ctx.save();
    ctx.beginPath();
    ctx.arc(padding.left + avatar.style.width / 2, padding.top + avatar.style.height / 2, avatar.style.width / 2 + outline.width, 0, Math.PI * 2);
    ctx.strokeStyle = outline.color;
    ctx.lineWidth = outline.width;
    ctx.stroke();
    ctx.restore();
    // avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(padding.left + avatar.style.width / 2, padding.top + avatar.style.height / 2, avatar.style.width / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar.image, padding.left, padding.top, avatar.style.width, avatar.style.height);
    ctx.restore();
  }
  if (nickname) {
    // nickname
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${nickname.style.fontSize}px ${font.normal.fontFamily}`;
    ctx.fillText(nickname.text, nickname.style.x, nickname.style.y);
    ctx.restore();
  }
}

export function drawFansNo(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { cardStyle, user } = options;
  const { color = "#ffffff", font } = cardStyle;
  const { no } = user;
  const { title, number } = no;
  // FANS NO.
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${title.style.fontSize}px ${font.mono.fontFamily}`;
  ctx.globalAlpha = font.mono.opacity;
  ctx.fillText(title.text, title.style.x, title.style.y);
  ctx.restore();
  if (number) {
    // number
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${number.style.fontSize}px ${font.kenney.fontFamily}`;
    ctx.letterSpacing = `${number.style.letterSpacing}px`;
    ctx.fillText(number.text, number.style.x, number.style.y);
    ctx.restore();
  }
}

export function drawDate(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { cardStyle, user } = options;
  const { color = "#ffffff", font } = cardStyle;
  const { date } = user;
  const { title, date: dateText } = date;
  // DATE
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${title.style.fontSize}px ${font.mono.fontFamily}`;
  ctx.globalAlpha = font.mono.opacity;
  ctx.fillText(title.text, title.style.x, title.style.y);
  ctx.restore();
  if (dateText) {
  // date
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${dateText.style.fontSize}px ${font.normal.fontFamily}`;
    ctx.letterSpacing = `${dateText.style.letterSpacing}px`;
    ctx.fillText(dateText.text, dateText.style.x, dateText.style.y);
    ctx.restore();
  }
}

export function compressImage(file: Blob, options?: { limit?: number; log?: boolean }) {
  const { limit, log = true } = options || {};
  return new Promise<File | Blob>((resolve, reject) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const compressor = new Compressor(file, {
      convertTypes: [file.type],
      convertSize: isDefined(limit) ? limit : Infinity,
      success(result) {
        if (log) {
          // eslint-disable-next-line no-console
          console.log("compressed");
        }
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

export function fitBackground(imageWidth: number, imageHeight: number) {
  const aspectRatio = 1 / 0.4115;

  let width, height, x, y;

  if (imageWidth / imageHeight > aspectRatio) {
    height = imageHeight;
    width = height * aspectRatio;
    x = (imageWidth - width) / 2;
    y = 0;
  } else {
    width = imageWidth;
    height = width / aspectRatio;
    x = 0;
    y = (imageHeight - height) / 2;
  }

  return {
    origin: [x, y] as [number, number],
    size: [width, height] as [number, number],
  };
}
