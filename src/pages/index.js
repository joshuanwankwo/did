import React, { useState } from "react";
import styles from "../styles/LandingPage.module.css";
import { useRouter } from "next/router";
import { getProfileFromCeramic } from "../util/didUtils";
// import { getProfileFromCeramic } from "../util/test";

import { userInfo } from "../util/didUtils";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    console.log("hello");
    const profile = await getProfileFromCeramic();
    console.log(profile);
    if (profile !== undefined) {
      if (profile !== null) {
        userInfo.name = profile?.name;
        userInfo.country = profile?.country;
        userInfo.role = profile?.role;
        userInfo.avatar = profile?.avatar;
        router.push("/profile");
        setLoading(false);
      } else {
        setLoading(false);
        router.push("/signup");
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Decentralized Identity</h1>
        <p className={styles.subtitle}>
          Redefine identity management on the decentralized web.
        </p>
        <button className={styles.ctaButton} onClick={handleGetStarted}>
          {loading ? "Signing in..." : "Sign-In with Ethereum"}
        </button>
      </div>
    </div>
  );
}
