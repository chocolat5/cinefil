import type { ReactElement } from "react";

import classes from "@/components/profile/Profile.module.css";
import Avatar from "@/components/ui/Avatar";
import * as Icon from "@/components/ui/Icons";
import SocialIconLink from "@/components/ui/SocialIconLink";
import type { Profile } from "@/types/types";

interface ProfileViewProps {
  userProfile: Profile;
}

export default function ProfileView({
  userProfile,
}: ProfileViewProps): ReactElement {
  return (
    <>
      <div className={classes.profileView}>
        <Avatar
          className={classes.avatar}
          url={userProfile.avatar}
          alt={userProfile.displayName}
        />
        <h2 className={classes.name}>{userProfile.displayName}</h2>
        <p className={classes.bio}>{userProfile.bio}</p>
        <div className={classes.socialLinksView}>
          {userProfile.socialLinks.letterboxd && (
            <SocialIconLink
              href={`https://letterboxd.com/${userProfile.socialLinks.letterboxd}`}
              ariaLabel="Letterboxd Link"
            >
              <Icon.Letterboxd />
            </SocialIconLink>
          )}
          {userProfile.socialLinks.bsky && (
            <SocialIconLink
              href={`https://bsky.app/profile/${userProfile.socialLinks.bsky}`}
              ariaLabel="Bluesky Link"
            >
              <Icon.Bluesky />
            </SocialIconLink>
          )}
          {userProfile.socialLinks.twitter && (
            <SocialIconLink
              href={`https://x.com/${userProfile.socialLinks.twitter}`}
              ariaLabel="Twitter Link"
            >
              <Icon.Twitter />
            </SocialIconLink>
          )}
          {userProfile.socialLinks.instagram && (
            <SocialIconLink
              href={`https://www.instagram.com/${userProfile.socialLinks.instagram}`}
              ariaLabel="Instagram Link"
            >
              <Icon.Instagram />
            </SocialIconLink>
          )}
          {userProfile.socialLinks.filmarks && (
            <SocialIconLink
              href={`https://filmarks.com/users/${userProfile.socialLinks.filmarks}`}
              ariaLabel="Filmarks Link"
            >
              <Icon.Filmarks />
            </SocialIconLink>
          )}
          {userProfile.socialLinks.website && (
            <SocialIconLink
              href={userProfile.socialLinks.website}
              ariaLabel="Website Link"
            >
              <Icon.Link />
            </SocialIconLink>
          )}
        </div>
      </div>
    </>
  );
}
