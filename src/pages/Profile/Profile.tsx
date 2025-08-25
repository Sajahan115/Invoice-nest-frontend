import Container from "../../components/Container/Container";
import Styles from "./Profile.module.css";
import { useEffect, useState } from "react";
import useAppContext from "../../context/useAppContext";
import { checkIfAdmin, getTokenPayload, showToast } from "../../utils/common";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import User from "../../components/User/User";
import api from "../../utils/axios";
import { UserProfileType } from "../../utils/interfaces";

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState<UserProfileType | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { userDetails, handleLoading } = useAppContext();

  const dataFormToken = getTokenPayload(sessionStorage.getItem("token"));
  const userId = userDetails?.id || dataFormToken?.id;
  const breadCrumbData = [
    {
      label: "Profile",
    },
  ];

  const editHandler = () => {
    setIsEditing(!isEditing);
  };

  const getUserDetails = async (userId: number) => {
    try {
      handleLoading(true, "Fetching user details, please wait...");
      const result = await api(`/user/${userId}`);
      const data = result.data?.data;
      setProfileDetails(data);
    } catch (error) {
      console.log(error);
      showToast("error", error.response || "Failed to fetch user details!");
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails(userId);
  }, []);

  return (
    <Container>
      <BreadCrumb items={breadCrumbData} />
      <div className={Styles.profileCard}>
        <User
          userId={userId}
          editHandler={editHandler}
          isEditing={isEditing}
          profileDetails={profileDetails}
          setProfileDetails={setProfileDetails}
          isAdmin={checkIfAdmin(dataFormToken)}
        />
      </div>
    </Container>
  );
};

export default Profile;
