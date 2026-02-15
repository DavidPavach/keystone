import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-fox-toast";

// Icons
import { AddSquare, Apple, CloseCircle, InfoCircle, Monitor, Mobile, Share, ArrowUp, TickCircle } from "iconsax-react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type Platform = "ios" | "android" | "desktop";

export default function InstallAppPage() {

    const [platform, setPlatform] = useState<Platform>("desktop");
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState<boolean>(false);
    const [dismissed, setDismissed] = useState<boolean>(false);

    const DISMISS_KEY = "pwaPromptDismissed";

    useEffect(() => {
        const stored = localStorage.getItem(DISMISS_KEY);
        if (stored === "true") {
            setDismissed(true);
            return;
        }

        const ua = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);
        setPlatform(isIOS ? "ios" : isAndroid ? "android" : "desktop");

        const standalone =
            window.matchMedia?.("(display-mode: standalone)")?.matches ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Boolean((navigator as any).standalone);

        setIsInstalled(Boolean(standalone));

        const onAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            toast.success("App installed");
        };

        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("appinstalled", onAppInstalled);
        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

        return () => {
            window.removeEventListener("appinstalled", onAppInstalled);
            window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        };
    }, []);

    const canPromptInstall = useMemo(() => !!deferredPrompt && !isInstalled, [deferredPrompt, isInstalled]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        try {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice.outcome === "accepted") toast.success("Installation started");
            else toast.error("Installation cancelled");
        } finally {
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, "true");
        setDismissed(true);
    };

    if (dismissed) {
        return (
            <div className="m-auto mt-6 max-w-4xl h-[40vh]">
                <div className="flex justify-between items-start gap-4 bg-lightBlack p-4 rounded-3xl ring-1 ring-white/10">
                    <div className="flex items-start gap-3">
                        <div className="place-items-center grid bg-black/25 rounded-2xl ring-1 ring-white/10 size-10 shrink-0">
                            <InfoCircle className="size-5 text-goldenYellow" />
                        </div>

                        <div className="min-w-0">
                            <div className="font-semibold text-neutral-100 text-sm md:text-base xl:text-lg">Install prompt dismissed</div>
                            <p className="mt-1 text-neutral-500">
                                You chose not to see the installation prompt again. If you change your mind, you can install from your
                                browser menu, or re-enable the prompt below.
                            </p>

                            <div className="flex sm:flex-row flex-col sm:items-center gap-2 mt-8">
                                <button type="button" onClick={() => {
                                    localStorage.removeItem("pwaPromptDismissed");
                                    setDismissed(false);
                                    toast.success("Install Prompt Re-enabled");
                                }}
                                    className="inline-flex justify-center items-center bg-primary hover:bg-accent px-3 py-2 rounded-2xl ring-1 ring-accent/30 font-semibold text-primaryYellow">
                                    Re-enable Prompt
                                </button>

                                <button type="button" onClick={() => {
                                    toast.info("Use your browser menu → Install App / Add to Home Screen");
                                }} className="inline-flex justify-center items-center bg-black/20 hover:bg-black/30 px-3 py-2 rounded-2xl ring-1 ring-white/10 font-semibold text-neutral-100">
                                    How to install manually
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const PlatformIcon = platform === "ios" ? Apple : platform === "android" ? Mobile : Monitor;

    return (
        <div className="text-white">
            {/* top bar */}
            <header className="flex justify-between items-center mx-auto py-4 max-w-4xl">
                <div className="flex items-center gap-3">
                    <div className="place-items-center grid bg-lightBlack rounded-2xl ring-1 ring-white/10 size-10">
                        <PlatformIcon className="size-5 text-primaryYellow" />
                    </div>
                    <div className="leading-tight">
                        <div className="font-medium text-primary text-xs">Keystone Web App</div>
                        <div className="font-semibold text-black">Install</div>
                    </div>
                </div>

                <button onClick={handleDismiss}
                    className="inline-flex items-center gap-2 bg-lightBlack hover:bg-red-600 px-3 py-2 rounded-2xl ring-1 ring-white/10 text-neutral-100 text-sm"
                    aria-label="Dismiss install page">
                    <CloseCircle className="size-5" />
                    Dismiss
                </button>
            </header>

            {/* content */}
            <main className="mx-auto pb-10 max-w-4xl">
                {/* device switcher + status */}
                <div className="bg-lightBlack p-5 rounded-3xl ring-1 ring-white/10">
                    <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4">
                        <div className="space-y-1">
                            <h1 className="font-semibold text-xl tracking-tight">Add this app to your device</h1>
                            <p className="text-[11px] text-neutral-500 md:text-xs xl:text-sm">
                                Install for faster access, full-screen experience, and a more native feel.
                            </p>
                        </div>

                        <div className="gap-x-2 grid grid-cols-3 bg-black/25 p-1 rounded-2xl ring-1 ring-white/10">
                            <DevicePill active={platform === "ios"} onClick={() => setPlatform("ios")} icon={<Apple className="size-4" />}>
                                iOS
                            </DevicePill>
                            <DevicePill active={platform === "android"} onClick={() => setPlatform("android")} icon={<Mobile className="size-4" />}>
                                Android
                            </DevicePill>
                            <DevicePill active={platform === "desktop"} onClick={() => setPlatform("desktop")} icon={<Monitor className="size-4" />}>
                                Desktop
                            </DevicePill>
                        </div>
                    </div>

                    <div className="bg-black/25 mt-4 p-4 rounded-2xl ring-1 ring-white/10">
                        {isInstalled ? (
                            <div className="flex items-start gap-3 mt-4">
                                <TickCircle className="mt-0.5 size-6 text-goldenYellow" />
                                <div>
                                    <div className="font-medium">Already installed</div>
                                    <div className="mt-1 text-[11px] text-neutral-500 md:text-xs xl:text-sm">
                                        Open it from your Home Screen / App launcher.
                                    </div>
                                </div>
                            </div>
                        ) : canPromptInstall ? (
                            <div className="flex items-start gap-3 mt-4">
                                <InfoCircle className="mt-0.5 size-6 text-accent" />
                                <div>
                                    <div className="font-medium">One-tap install available</div>
                                    <div className="mt-1 text-[11px] text-neutral-500 md:text-xs xl:text-sm">
                                        Tap Install below. Your browser will show a confirmation prompt.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 mt-4">
                                <InfoCircle className="mt-0.5 size-6 text-goldenYellow" />
                                <div>
                                    <div className="font-medium">Install via browser menu</div>
                                    <div className="mt-1 text-[11px] text-neutral-500 md:text-xs xl:text-sm">
                                        Some devices (especially iOS) don’t show a one-tap install button. Use the steps below.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA row */}
                    <div className="flex sm:flex-row flex-col sm:items-center gap-3 mt-4">
                        <button onClick={handleInstall} disabled={!canPromptInstall}
                            className={["inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition sm:w-auto",
                                canPromptInstall ? "bg-primary text-primaryYellow ring-accent/30 hover:bg-accent"
                                    : "bg-black/20 text-neutral-500 ring-white/10 cursor-not-allowed",
                            ].join(" ")}>
                            <AddSquare className="size-5" />
                            Install App
                        </button>

                        <div className="text-neutral-500 text-xs">
                            {platform === "ios" ? "iOS installs from Safari → Share → Add to Home Screen."
                                : "If Install is disabled, follow the manual steps below."}
                        </div>
                    </div>
                </div>

                {/* steps */}
                <section className="bg-lightBlack mt-6 p-5 rounded-3xl ring-1 ring-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">Installation steps</h2>
                        <span className="text-neutral-500 text-xs">Takes ~10 seconds</span>
                    </div>

                    {platform === "ios" ? (
                        <ol className="space-y-3">
                            <Step idx={1} icon={<Share className="size-5" />} title="Open the Share menu in Safari"
                                desc="Tap the Share icon at the bottom (square with an arrow up)."
                                badge={
                                    <span className="inline-flex items-center gap-2 bg-black/25 px-3 py-1 rounded-xl ring-1 ring-white/10 text-primaryYellow text-xs">
                                        <ArrowUp className="size-4 text-primaryYellow" />
                                        Look for the ⬆️ arrow
                                    </span>
                                }
                            />
                            <Step idx={2} icon={<AddSquare className="size-5" />} title="Select “Add to Home Screen”"
                                desc="Scroll the Share sheet until you see Add to Home Screen." />

                            <Step idx={3} icon={<TickCircle className="size-5" />}
                                title="Confirm"
                                desc="Tap Add. The app icon will appear on your Home Screen." />
                        </ol>
                    ) : platform === "android" ? (
                        <ol className="space-y-3">
                            <Step idx={1} icon={<InfoCircle className="size-5" />} title="Open the browser menu"
                                desc="In Chrome, tap the ⋮ menu (top-right)." />

                            <Step idx={2} icon={<AddSquare className="size-5" />}
                                title="Tap “Install app” or “Add to Home Screen”"
                                desc="Pick the install option, then confirm." />

                            <Step idx={3} icon={<TickCircle className="size-5" />}
                                title="Launch from Home Screen"
                                desc="Open it anytime from the new icon." />
                        </ol>
                    ) : (
                        <ol className="space-y-3">
                            <Step idx={1} icon={<Monitor className="size-5" />}
                                title="Open your browser install option"
                                desc="In Chrome/Edge, look for an install icon in the address bar or browser menu." />

                            <Step idx={2} icon={<AddSquare className="size-5" />}
                                title="Click Install"
                                desc="Confirm the prompt to add the app to your device." />

                            <Step idx={3} icon={<TickCircle className="size-5" />}
                                title="Pin it"
                                desc="Pin to your taskbar/dock for faster access." />
                        </ol>
                    )}

                    <div className="bg-black/25 mt-5 p-4 rounded-2xl ring-1 ring-white/10">
                        <div className="font-semibold text-[11px] text-primaryYellow md:text-xs xl:text-sm">Troubleshooting</div>
                        <ul className="space-y-1 mt-2 text-[11px] text-neutral-500 md:text-xs xl:text-sm">
                            <li>• If you don’t see install options, try Safari (iOS) or Chrome/Edge (Android/Desktop).</li>
                            <li>• If you installed before, uninstall and refresh if the prompt won’t appear.</li>
                            <li>• Some browsers hide install until the PWA meets installability checks.</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}

function DevicePill({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <button onClick={onClick} className={[
            "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition",
            active ? "bg-primary text-primaryYellow" : "text-neutral-500 hover:bg-black/20 hover:text-neutral-100",
        ].join(" ")}
            type="button">
            {icon}
            {children}
        </button>
    );
}

function Step({ idx, icon, title, desc, badge }: { idx: number; icon: React.ReactNode; title: string; desc: string; badge?: React.ReactNode }) {
    return (
        <li className="flex gap-3 bg-black/20 p-4 rounded-2xl ring-1 ring-white/10">
            <div className="flex items-start gap-3">
                <div className="place-items-center grid bg-lightBlack rounded-2xl ring-1 ring-white/10 size-10 text-primaryYellow">
                    {icon}
                </div>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex justify-center items-center bg-primary rounded-full size-6 font-bold text-primaryYellow text-xs">
                            {idx}
                        </span>
                        <div className="font-semibold">{title}</div>
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500 md:text-xs xl:text-sm">{desc}</div>
                    {badge ? <div className="mt-2">{badge}</div> : null}
                </div>
            </div>
        </li>
    );
}
