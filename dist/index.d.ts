import * as react_jsx_runtime from 'react/jsx-runtime';

type RGB = {
    r: number;
    g: number;
    b: number;
};
type GradientType = 'linear' | 'animated' | 'conic' | 'wave' | 'silk' | 'smoke' | 'stripe' | 'mesh' | 'aurora';
type GradientConfig = {
    color1: RGB;
    color2: RGB;
    color3: RGB;
    speed: number;
    scale: number;
    type: GradientType;
    noise: number;
};
type GradientConfigInput = {
    color1?: string | RGB;
    color2?: string | RGB;
    color3?: string | RGB;
    speed?: number;
    scale?: number;
    type?: GradientType;
    noise?: number;
};
type GradFlowProps = {
    config?: GradientConfigInput;
    preset?: 'cosmic' | 'matrix' | 'electric' | 'inferno' | 'mystic' | 'cyber' | 'neon' | 'plasma' | 'dream' | 'borealis';
    /** Freeze the animation. A single static frame is still rendered. */
    paused?: boolean;
    className?: string;
};

declare function GradFlow({ config: initialConfig, preset, paused, className, }: GradFlowProps): react_jsx_runtime.JSX.Element;

declare const DEFAULT_CONFIG: GradientConfig;
declare const GRADIENT_TYPE_NUMBER: Record<GradientType, number>;
declare const PRESETS: {
    readonly cosmic: {
        readonly color1: {
            readonly r: 91;
            readonly g: 33;
            readonly b: 182;
        };
        readonly color2: {
            readonly r: 30;
            readonly g: 64;
            readonly b: 175;
        };
        readonly color3: {
            readonly r: 8;
            readonly g: 5;
            readonly b: 24;
        };
        readonly speed: 0.4;
        readonly scale: 1.2;
        readonly type: GradientType;
        readonly noise: 0.1;
    };
    readonly matrix: {
        readonly color1: {
            readonly r: 6;
            readonly g: 20;
            readonly b: 12;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 74;
            readonly g: 255;
            readonly b: 128;
        };
        readonly speed: 0.8;
        readonly scale: 1;
        readonly type: GradientType;
        readonly noise: 0.12;
    };
    readonly electric: {
        readonly color1: {
            readonly r: 14;
            readonly g: 82;
            readonly b: 255;
        };
        readonly color2: {
            readonly r: 130;
            readonly g: 220;
            readonly b: 255;
        };
        readonly color3: {
            readonly r: 255;
            readonly g: 255;
            readonly b: 255;
        };
        readonly speed: 0.9;
        readonly scale: 2;
        readonly type: GradientType;
        readonly noise: 0.16;
    };
    readonly inferno: {
        readonly color1: {
            readonly r: 120;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color2: {
            readonly r: 20;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 255;
            readonly g: 140;
            readonly b: 0;
        };
        readonly speed: 0.9;
        readonly scale: 1.1;
        readonly type: GradientType;
        readonly noise: 0.2;
    };
    readonly mystic: {
        readonly color1: {
            readonly r: 210;
            readonly g: 170;
            readonly b: 255;
        };
        readonly color2: {
            readonly r: 10;
            readonly g: 0;
            readonly b: 30;
        };
        readonly color3: {
            readonly r: 80;
            readonly g: 30;
            readonly b: 130;
        };
        readonly speed: 0.7;
        readonly scale: 1.8;
        readonly type: GradientType;
        readonly noise: 0.16;
    };
    readonly cyber: {
        readonly color1: {
            readonly r: 0;
            readonly g: 245;
            readonly b: 255;
        };
        readonly color2: {
            readonly r: 5;
            readonly g: 5;
            readonly b: 20;
        };
        readonly color3: {
            readonly r: 255;
            readonly g: 0;
            readonly b: 200;
        };
        readonly speed: 0.9;
        readonly scale: 2;
        readonly type: GradientType;
        readonly noise: 0.2;
    };
    readonly neon: {
        readonly color1: {
            readonly r: 255;
            readonly g: 0;
            readonly b: 122;
        };
        readonly color2: {
            readonly r: 10;
            readonly g: 10;
            readonly b: 10;
        };
        readonly color3: {
            readonly r: 0;
            readonly g: 255;
            readonly b: 170;
        };
        readonly speed: 0.6;
        readonly scale: 1.6;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly plasma: {
        readonly color1: {
            readonly r: 200;
            readonly g: 60;
            readonly b: 255;
        };
        readonly color2: {
            readonly r: 30;
            readonly g: 0;
            readonly b: 60;
        };
        readonly color3: {
            readonly r: 255;
            readonly g: 110;
            readonly b: 60;
        };
        readonly speed: 0.6;
        readonly scale: 1.2;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly dream: {
        readonly color1: {
            readonly r: 255;
            readonly g: 153;
            readonly b: 204;
        };
        readonly color2: {
            readonly r: 120;
            readonly g: 170;
            readonly b: 255;
        };
        readonly color3: {
            readonly r: 196;
            readonly g: 160;
            readonly b: 255;
        };
        readonly speed: 0.5;
        readonly scale: 1;
        readonly type: GradientType;
        readonly noise: 0.06;
    };
    readonly borealis: {
        readonly color1: {
            readonly r: 64;
            readonly g: 224;
            readonly b: 160;
        };
        readonly color2: {
            readonly r: 4;
            readonly g: 8;
            readonly b: 28;
        };
        readonly color3: {
            readonly r: 120;
            readonly g: 80;
            readonly b: 255;
        };
        readonly speed: 0.5;
        readonly scale: 1.2;
        readonly type: GradientType;
        readonly noise: 0.1;
    };
};

/**
 * Converts a hex color string to RGB object
 * @param hex - Hex color string (e.g., '#ff0000' or 'ff0000')
 * @returns RGB object with r, g, b values (0-255)
 */
declare function hexToRgb(hex: string): RGB;
/**
 * Converts RGB object to hex color string
 * @param rgb - RGB object with r, g, b values (0-255)
 * @returns Hex color string with # prefix
 */
declare function rgbToHex(rgb: RGB): string;
/**
 * Normalizes color input to RGB object
 * @param color - Hex string or RGB object
 * @returns RGB object
 */
declare function normalizeColor(color: string | RGB): RGB;

declare function randomRGB(): RGB;
declare function generateRandomColors(): Partial<GradientConfig>;

export { DEFAULT_CONFIG, GRADIENT_TYPE_NUMBER, GradFlow, type GradFlowProps, type GradientConfig, type GradientConfigInput, type GradientType, PRESETS, type RGB, GradFlow as default, generateRandomColors, hexToRgb, normalizeColor, randomRGB, rgbToHex };
