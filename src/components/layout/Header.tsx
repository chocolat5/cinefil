import { Suspense, lazy, useState } from "react";
import type { ReactElement } from "react";

import { navigate } from "astro:transitions/client";

import classes from "@/components/layout/Header.module.css";
import Button from "@/components/ui/Button";
import {
  ArrowLeft as ArrowLeftIcon,
  MenuHorizontal,
  SiteLogo as SiteLogoIcon,
} from "@/components/ui/Icons";
import LinkButton from "@/components/ui/LinkButton";
import { useAppStore } from "@/stores/useAppStore";
import { getQrCodeImage } from "@/utils/helpers";

const BottomSheet = lazy(() => import("@/components/ui/BottomSheet"));

interface HeaderProps {
  userId: string;
  isAuthenticated: boolean;
  currentPath: string;
}

type MenuMode = "menu" | "qr";

export default function Header({
  userId,
  isAuthenticated,
  currentPath,
}: HeaderProps): ReactElement {
  const { editMode, logout, showToast } = useAppStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuMode, setMenuMode] = useState<MenuMode>("menu");

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate(`/`);
  };

  return (
    <>
      <header className={classes.header}>
        <a className={classes.skipLink} href="#main-content">
          Skip to main content
        </a>
        <h1 className={classes.title}>
          <a href="/">
            <SiteLogoIcon />
            cinefil
          </a>
        </h1>
        <button
          className={classes.button}
          onClick={() => setIsOpen(true)}
          disabled={editMode !== "none"}
          aria-label="Open Menu"
        >
          <MenuHorizontal />
        </button>
      </header>
      <Suspense fallback={null}>
        <BottomSheet
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setMenuMode("menu");
          }}
        >
          <>
            {menuMode === "menu" && (
              <aside className={classes.menu}>
                {isAuthenticated && userId && currentPath === `/${userId}` && (
                  <Button
                    onClick={() => setMenuMode("qr")}
                    aria-label="View QR Code"
                  >
                    View QR Code
                  </Button>
                )}
                {!isAuthenticated && (
                  <LinkButton href="/login" ariaLabel="Login">
                    Login
                  </LinkButton>
                )}
                {isAuthenticated && currentPath !== `/${userId}` && (
                  <LinkButton href={`/${userId}`} ariaLabel="Profile page">
                    Your Profile
                  </LinkButton>
                )}
                {isAuthenticated && (
                  <Button
                    variant="outlined"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    Logout
                  </Button>
                )}
              </aside>
            )}
            {menuMode === "qr" && (
              <div className={classes.qrContainer}>
                <button
                  className={classes.backButton}
                  onClick={() => setMenuMode("menu")}
                >
                  <ArrowLeftIcon />
                  Back
                </button>
                <img
                  src={getQrCodeImage(userId)}
                  alt="QR Code"
                  onError={() => showToast("Failed to load QR code", "error")}
                  width="153"
                  height="153"
                  loading="lazy"
                />
              </div>
            )}
          </>
        </BottomSheet>
      </Suspense>
    </>
  );
}
