export interface TemplateManifest {
  id: string;
  type: "default" | "custom";
  name: string;
  copywriting: {
    name: string;
    link: string;
    post: string;
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
      image: string;
      origin: [number, number];
      size: [number, number];
      color?: string;
    };
  };
}
