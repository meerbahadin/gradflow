import React from 'react';

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

declare function GradFlow({ config: initialConfig, preset, paused, className, }: GradFlowProps): React.JSX.Element;

declare const DEFAULT_CONFIG: GradientConfig;
declare const GRADIENT_TYPE_NUMBER: Record<GradientType, number>;
declare const PRESETS: {
    readonly cosmic: {
        readonly color1: {
            readonly r: 85;
            readonly g: 4;
            readonly b: 129;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 145;
            readonly b: 255;
        };
        readonly color3: {
            readonly r: 0;
            readonly g: 4;
            readonly b: 5;
        };
        readonly speed: 0.4;
        readonly scale: 1.2;
        readonly type: GradientType;
        readonly noise: 0.1;
    };
    readonly matrix: {
        readonly color1: {
            readonly r: 34;
            readonly g: 54;
            readonly b: 145;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 147;
            readonly g: 251;
            readonly b: 173;
        };
        readonly speed: 0.8;
        readonly scale: 1;
        readonly type: GradientType;
        readonly noise: 0.1;
    };
    readonly electric: {
        readonly color1: {
            readonly r: 5;
            readonly g: 65;
            readonly b: 245;
        };
        readonly color2: {
            readonly r: 178;
            readonly g: 224;
            readonly b: 209;
        };
        readonly color3: {
            readonly r: 87;
            readonly g: 229;
            readonly b: 149;
        };
        readonly speed: 0.9;
        readonly scale: 2;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly inferno: {
        readonly color1: {
            readonly r: 77;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 255;
            readonly g: 187;
            readonly b: 0;
        };
        readonly speed: 0.9;
        readonly scale: 1.1;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly mystic: {
        readonly color1: {
            readonly r: 192;
            readonly g: 155;
            readonly b: 197;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 53;
            readonly g: 0;
            readonly b: 97;
        };
        readonly speed: 0.9;
        readonly scale: 2;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly cyber: {
        readonly color1: {
            readonly r: 102;
            readonly g: 237;
            readonly b: 255;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 0;
            readonly g: 255;
            readonly b: 110;
        };
        readonly speed: 0.9;
        readonly scale: 2;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly neon: {
        readonly color1: {
            readonly r: 102;
            readonly g: 237;
            readonly b: 255;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 0;
            readonly g: 255;
            readonly b: 110;
        };
        readonly speed: 0.6;
        readonly scale: 2;
        readonly type: GradientType;
        readonly noise: 0.18;
    };
    readonly plasma: {
        readonly color1: {
            readonly r: 163;
            readonly g: 106;
            readonly b: 242;
        };
        readonly color2: {
            readonly r: 0;
            readonly g: 0;
            readonly b: 0;
        };
        readonly color3: {
            readonly r: 234;
            readonly g: 130;
            readonly b: 106;
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
