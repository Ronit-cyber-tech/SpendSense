"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../../components/Card";

type Theme = "light" | "dark";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [sounds, setSounds] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("spendsense_theme") as Theme) ||
      "light";

    const savedSounds =
      localStorage.getItem("spendsense_sounds") !== "false";

    const savedAnimations =
      localStorage.getItem("spendsense_animations") !== "false";

    const savedLargeText =
      localStorage.getItem("spendsense_large_text") === "true";

    const savedHighContrast =
      localStorage.getItem("spendsense_high_contrast") === "true";

    const savedCompact =
      localStorage.getItem("spendsense_compact") === "true";

    setTheme(savedTheme);
    setSounds(savedSounds);
    setAnimations(savedAnimations);
    setLargeText(savedLargeText);
    setHighContrast(savedHighContrast);
    setCompactMode(savedCompact);

    applyTheme(savedTheme);
    applyLargeText(savedLargeText);
    applyContrast(savedHighContrast);
    applyAnimations(savedAnimations);
    applyCompact(savedCompact);
  }, []);

  const applyTheme = (value: Theme) => {
    document.documentElement.classList.toggle(
      "dark",
      value === "dark"
    );
  };

  const applyLargeText = (enabled: boolean) => {
    document.documentElement.classList.toggle(
      "large-text",
      enabled
    );
  };

  const applyContrast = (enabled: boolean) => {
    document.documentElement.classList.toggle(
      "high-contrast",
      enabled
    );
  };

  const applyAnimations = (enabled: boolean) => {
    document.documentElement.classList.toggle(
      "reduce-animation",
      !enabled
    );
  };

  const applyCompact = (enabled: boolean) => {
    document.documentElement.classList.toggle(
      "compact-mode",
      enabled
    );
  };

  const changeTheme = (value: Theme) => {
    setTheme(value);

    localStorage.setItem(
      "spendsense_theme",
      value
    );

    applyTheme(value);
  };

  const toggleSounds = () => {
    const next = !sounds;

    setSounds(next);

    localStorage.setItem(
      "spendsense_sounds",
      String(next)
    );
  };

  const toggleAnimations = () => {
    const next = !animations;

    setAnimations(next);

    localStorage.setItem(
      "spendsense_animations",
      String(next)
    );

    applyAnimations(next);
  };

  const toggleLargeText = () => {
    const next = !largeText;

    setLargeText(next);

    localStorage.setItem(
      "spendsense_large_text",
      String(next)
    );

    applyLargeText(next);
  };

  const toggleContrast = () => {
    const next = !highContrast;

    setHighContrast(next);

    localStorage.setItem(
      "spendsense_high_contrast",
      String(next)
    );

    applyContrast(next);
  };

  const toggleCompact = () => {
    const next = !compactMode;

    setCompactMode(next);

    localStorage.setItem(
      "spendsense_compact",
      String(next)
    );

    applyCompact(next);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">
          Settings
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Customize how SpendSense looks and behaves.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Appearance">
          <div className="space-y-5">
            <div>
              <div className="font-medium mb-2">
                Theme
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    changeTheme("light")
                  }
                  className={`border rounded-lg p-3 ${
                    theme === "light"
                      ? "border-primary bg-blue-50"
                      : ""
                  }`}
                >
                  ☀️ Light
                </button>

                <button
                  onClick={() =>
                    changeTheme("dark")
                  }
                  className={`border rounded-lg p-3 ${
                    theme === "dark"
                      ? "border-primary bg-blue-50"
                      : ""
                  }`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            <SettingToggle
              label="Compact layout"
              description="Reduce spacing to fit more information on screen."
              checked={compactMode}
              onChange={toggleCompact}
            />

            <SettingToggle
              label="Interface animations"
              description="Enable smooth transitions and animations."
              checked={animations}
              onChange={toggleAnimations}
            />
          </div>
        </Card>

        <Card title="Sound & Notifications">
          <div className="space-y-5">
            <SettingToggle
              label="Interface sounds"
              description="Play subtle sounds for important actions."
              checked={sounds}
              onChange={toggleSounds}
            />

            <div className="text-xs text-gray-500">
              Sound preference is saved. You can later use it
              for transaction confirmations, quiz completion,
              alerts and reminders.
            </div>
          </div>
        </Card>

        <Card title="Accessibility">
          <div className="space-y-5">
            <SettingToggle
              label="Large text"
              description="Increase text size for easier reading."
              checked={largeText}
              onChange={toggleLargeText}
            />

            <SettingToggle
              label="High contrast"
              description="Increase contrast between text and backgrounds."
              checked={highContrast}
              onChange={toggleContrast}
            />
          </div>
        </Card>

        <Card title="Privacy & Data">
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              Your current SpendSense version stores account and
              financial information locally in this browser.
            </div>

            <div>
              Settings are also saved locally so they remain
              after refreshing the website.
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800">
              For a public production website, move authentication
              and financial records to a secure backend/database.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-medium">
          {label}
        </div>

        <div className="text-sm text-gray-500 mt-1">
          {description}
        </div>
      </div>

      <button
        onClick={onChange}
        type="button"
        className={`relative w-12 h-6 rounded-full transition ${
          checked ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}