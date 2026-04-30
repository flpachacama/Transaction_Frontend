"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalLink = void 0;
const expo_router_1 = require("expo-router");
const expo_web_browser_1 = require("expo-web-browser");
function ExternalLink(_a) {
    var { href } = _a, rest = __rest(_a, ["href"]);
    return (<expo_router_1.Link target="_blank" {...rest} href={href} onPress={(event) => __awaiter(this, void 0, void 0, function* () {
            if (process.env.EXPO_OS !== 'web') {
                // Prevent the default behavior of linking to the default browser on native.
                event.preventDefault();
                // Open the link in an in-app browser.
                yield (0, expo_web_browser_1.openBrowserAsync)(href, {
                    presentationStyle: expo_web_browser_1.WebBrowserPresentationStyle.AUTOMATIC,
                });
            }
        })}/>);
}
exports.ExternalLink = ExternalLink;
