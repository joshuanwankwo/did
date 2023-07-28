/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import styles from "../styles/SignUp.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { sendDataToCeramic } from "../util/didUtils";
import { userInfo as user } from "../util/didUtils";
import { editMode } from "../util/didUtils";

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    country: "",
    avatar: "",
    role: "",
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    const profile = await sendDataToCeramic(userInfo);
    try {
      if (profile) {
        user.name = profile.name;
        user.country = profile.country;
        user.role = profile.role;
        user.avatar = profile.avatar;
        router.push("/profile");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserInfo({ ...user });
  }, []);

  return (
    <div className={styles.container}>
      <p>
        {editMode.editMode
          ? "Update once, use everywhere"
          : "Your don't have a Ceramic account, please sign up below"}
      </p>
      <div className={styles.card}>
        <h1>{editMode.editMode ? "Update your DID" : "Sign Up"}</h1>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <input
          className={styles.input}
          type="text"
          placeholder="Name"
          value={userInfo.name}
          onChange={(e) =>
            setUserInfo({
              ...userInfo,
              name: e.target.value,
            })
          }
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Country"
          value={userInfo.country}
          onChange={(e) =>
            setUserInfo({
              ...userInfo,
              country: e.target.value,
            })
          }
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Role"
          value={userInfo.role}
          onChange={(e) =>
            setUserInfo({
              ...userInfo,
              role: e.target.value,
            })
          }
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Image url"
          value={userInfo.avatar}
          onChange={(e) =>
            setUserInfo({
              ...userInfo,
              avatar: e.target.value,
            })
          }
        />

        <button
          className={styles.button}
          onClick={() => {
            handleSubmit(userInfo);
          }}
        >
          {loading ? "Updating..." : editMode.editMode ? "Update" : " Sign Up"}
        </button>
        {!editMode.editMode && (
          <p>
            Already have an account?
            <Link href="/">Sign In</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
