if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let d={};const l=e=>n(e,a),o={module:{uri:a},exports:d,require:l};i[a]=Promise.all(s.map((e=>o[e]||l(e)))).then((e=>(r(...e),d)))}}define(["./workbox-30e9d199"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"5cad6896b24b6391b7d564ad1bcfd39d"},{url:"assets/avatar.489e79b5.jpg",revision:null},{url:"assets/index-legacy.55922c22.js",revision:null},{url:"assets/index.008457bf.css",revision:null},{url:"assets/index.9c34fc61.js",revision:null},{url:"assets/Kenney-Mini-Square.ea0904c4.ttf",revision:null},{url:"assets/polyfills-legacy.1952bbaa.js",revision:null},{url:"index.html",revision:"2cb08647bce738bfa2bb980850ed59aa"},{url:"logo.png",revision:"48f8d5b420f883dca288a280cb27f370"},{url:"origin.png",revision:"2d22bf3be94db86092281485db9356aa"},{url:"pwa-192x192.png",revision:"6e74cda382d143e725114ed6e32d8b5e"},{url:"pwa-512x512.png",revision:"563513e9a85806f10be6c5892fa4723a"},{url:"registerSW.js",revision:"b99f11a57799a3c54d4b5924bd716db5"},{url:"safari-pinned-tab.svg",revision:"3cedd37d6f8fb6d08cd1e10ac96b1a3b"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"favicon.ico",revision:"dac2d2b91f94230f2168f6ecfdc207c9"},{url:"apple-touch-icon.png",revision:"5cad6896b24b6391b7d564ad1bcfd39d"},{url:"pwa-192x192.png",revision:"6e74cda382d143e725114ed6e32d8b5e"},{url:"pwa-512x512.png",revision:"563513e9a85806f10be6c5892fa4723a"},{url:"manifest.webmanifest",revision:"db1ba7225ee0e96d790ee4e99807ba43"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
