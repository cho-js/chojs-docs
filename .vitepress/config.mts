import {defineConfig} from "vitepress";
import {twoandhalfslash} from "twoandhalfslash";

/*
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SXHNBW6X10"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-SXHNBW6X10');
</script>
 */
// https://vitepress.dev/reference/site-config
export default defineConfig({
    markdown: {
        lineNumbers: true,
        codeTransformers: [twoandhalfslash()],
    },
    head: [
        [
            "script",
            {
                async: true,
                src: "https://www.googletagmanager.com/gtag/js?id=G-SXHNBW6X10",
            },
        ],
        [
            "script",
            {},
            ` 
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SXHNBW6X10');
            `,
        ],
    ],
    base: "/chojs-docs/",

    title: "CHO",
    description: "documentation",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: "Home", link: "/"},
            {text: "Examples", link: "/examples"},
        ],

        sidebar: [
            {
                text: "Introduction",
                link: "/overview/introduction",
            },
            {
                text: "Quick Start",
                link: "/overview/quick-start",
            },
            {
                text: "Guides",
                items: [
                    {
                        text: "Dependency Injection",
                        collapsed: true,
                        items: [
                            {text: "DI Overview", link: "/guide/di-overview"},
                            {text: "Providers", link: "/guide/di-providers"},
                            {
                                text: "Injectables",
                                link: "/guide/di-injectables",
                            },
                            {text: "Modules", link: "/guide/di-modules"},
                            {text: "Injector", link: "/guide/di-injector"},
                            {text: "Testing", link: "/guide/injectables"},
                        ],
                    },
                    {
                        text: "Command Line Apps",
                        collapsed: true,
                        items: [
                            {
                                text: "Command Line Quick Start",
                                link: "/guide/cmd-01-quick-start",
                            },
                            {
                                text: "Defining Commands",
                                link: "/guide/cmd-02-defining-commands",
                            },
                        ],
                    },
                    {
                        text: "Web Server Apps",
                        collapsed: true,
                        items: [
                            {
                                text: "Quick Start",
                                link: "/guide/web-quick-start",
                            },
                            {text: "Controllers", link: "/guide/controllers"},
                            {text: "Providers", link: "/guide/providers"},
                            {text: "Middlewares", link: "/guide/middlewares"},
                        ],
                    },
                    {
                        text: "Event Driven Apps",
                        collapsed: true,
                        items: [
                            {text: "Controllers", link: "/guide/x"},
                            {text: "Providers", link: "/guide/s"},
                            {text: "Middlewares", link: "/guide/a"},
                        ],
                    },
                    {
                        text: "Hybrid Apps",
                        collapsed: true,
                        items: [
                            {text: "Controllers", link: "/guide/x"},
                            {text: "Providers", link: "/guide/s"},
                            {text: "Middlewares", link: "/guide/a"},
                        ],
                    },
                ],
            },
            {
                text: "Specifications",
                items: [
                    {text: "Dependency Injection", link: "/specs/di"},
                    {text: "Applications", link: "/specs/application"},
                    {text: "Command", link: "/specs/command"},
                    {text: "Web", link: "/specs/web"},
                ],
            },
            {
                text: "API Reference",
                link: "https://ziv.github.io/cho/ref/all_symbols.html",
            },
        ],

        socialLinks: [
            {icon: "github", link: "https://github.com/ziv/cho"},
        ],
    },
});
