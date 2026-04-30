"use strict";
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeColor = void 0;
const theme_1 = require("@/constants/theme");
const use_color_scheme_1 = require("@/hooks/use-color-scheme");
function useThemeColor(props, colorName) {
    var _a;
    const theme = (_a = (0, use_color_scheme_1.useColorScheme)()) !== null && _a !== void 0 ? _a : 'light';
    const colorFromProps = props[theme];
    if (colorFromProps) {
        return colorFromProps;
    }
    else {
        return theme_1.Colors[theme][colorName];
    }
}
exports.useThemeColor = useThemeColor;
