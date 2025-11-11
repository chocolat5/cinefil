import type { CSSProperties, ReactElement } from "react";

interface OgImageFallBackProps {
  styles: CSSProperties;
}

export function OgImageFallBack({
  styles,
}: OgImageFallBackProps): ReactElement {
  return <div style={{ ...styles }}>cinefill - your cinema profile</div>;
}

interface OgImageProps {
  baseStyle: CSSProperties;
  avatar: string;
  displayName: string;
  siteUrl: string;
}

export function OgImage({
  baseStyle,
  avatar,
  displayName,
  siteUrl,
}: OgImageProps): ReactElement {
  return (
    <div
      style={{
        ...baseStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          overflow: "hidden",
          width: 300,
          height: 300,
          backgroundColor: "#326cfe",
          color: "#fbfbfb",
        }}
      >
        {avatar ? (
          <img
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
            src={avatar}
            width="80"
            height="80"
            alt={displayName}
          />
        ) : (
          <span
            style={{
              color: "#fff",
              fontSize: 80,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {displayName.substring(0, 1)}
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: 64,
        }}
      >
        {displayName}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 4,
          textAlign: "center",
          fontSize: 48,
        }}
      >
        <img
          src={`${siteUrl}/images/logo.svg`}
          width="40"
          height="40"
          alt="cinefil logo"
        />
        cinefil.me
      </div>
    </div>
  );
}
