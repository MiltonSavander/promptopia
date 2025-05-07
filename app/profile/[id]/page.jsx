"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "@node_modules/next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params; // Unwrap the params Promise
      setUserId(unwrappedParams.id); // Set the userId state
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();

      console.log(data);
      setUserPosts(data);
    };

    fetchPosts();
  }, [userId]);

  return (
    <Suspense>
      <Profile
        name={userName}
        desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
        data={userPosts}
      />
    </Suspense>
  );
};

export default UserProfile;
