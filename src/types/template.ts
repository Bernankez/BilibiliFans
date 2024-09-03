export interface TemplateManifest<T extends string | Blob = string> {
  id: string;
  type: "default" | "custom";
  name: string;
  copywriting: {
    name: string;
    link: string;
    post?: string;
  };
  cardStyle: {
    color: string;
    foreground?: {
      gradient: {
        [K in "left" | "right"]?: {
          start: number;
          end: number;
          color: string;
        };
      };
    };
    background: {
      image?: T;
      origin: [number, number];
      size: [number, number];
      color?: string;
    };
  };
}
