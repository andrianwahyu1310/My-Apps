import React from "react";
import katex from "katex";
// import "katex/dist/katex.min.css";
// import "../../node_modules.katex/dist/katex-min.css";
import "../../node_modules/katex/dist/katex.min.css";

export function autoLatex(text) {
    if (!text) return "";

    let t = String(text).trim();

    t = t.replace(/\$/g, "");

    const containsLatex =
        /\\[a-zA-Z]+/.test(t);

    if (!containsLatex) {

        t = t.replace(
            /\b([a-zA-Z]+)(\d+)\b/g,
            "$1^{$2}"
        );

        t = t.replace(
            /(\d+)\^(-?\d+)/g,
            "$1^{$2}"
        );

        t = t.replace(
            /(\d+)\s*x\s*(\d+)/g,
            "$1 \\\\times $2"
        );
    }

    return t;
}

export function Latex({
    children,
    block = false,
    className = ""
}) {

    const html =
        katex.renderToString(
            autoLatex(children),
            {
                displayMode: block,
                throwOnError: false,
                strict: false
            }
        );

    return React.createElement(
        "span",
        {
            className,
            dangerouslySetInnerHTML: {
                __html: html
            }
        }
    );
}