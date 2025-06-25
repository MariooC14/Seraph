type UserConfig = {
  theme: 'dark' | 'light';
  windowConfig: {
    width: number;
    height: number;
    maximized: boolean;
    x?: number;
    y?: number;
  };
};
