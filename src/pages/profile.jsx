/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import styles from "../styles/Profile.module.scss";
import { useRouter } from "next/router";
import { userInfo } from "../util/didUtils";
import { editMode } from "../util/didUtils";

const Profile = () => {
  const router = useRouter();

  const handleEdit = () => {
    editMode.editMode = true;
    router.push("/signup");
  };

  useEffect(() => {
    getProfileFromCeramic();
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <img src={userInfo.avatar} alt="" />
          <p>
            <b>Name:</b> {userInfo.name}
          </p>
          <p>
            <b>Role:</b> {userInfo.role}
          </p>
          <p>
            <b>Country:</b> {userInfo.country}
          </p>
          <button
            className={styles.button}
            onClick={() => {
              handleEdit();
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
