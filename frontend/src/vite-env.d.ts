/// <reference types="vite/client" />

interface Window {
    fbAsyncInit: () => void;
    FB: {
        init: (params: {
            appId: string;
            cookie: boolean;
            xfbml: boolean;
            version: string;
        }) => void;
        login: (callback: (response: any) => void, options?: { scope: string }) => void;
        logout: () => void;
        getLoginStatus: (callback: (response: any) => void) => void;
        api: (path: string, callback: (response: any) => void) => void;
    };
}
