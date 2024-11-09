"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // status is the loading state for session
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    // Only fetch posts if the user is logged in
    if (session?.user?.id) {
      const fetchPosts = async () => {
        const response = await fetch(`/api/users/${session?.user.id}/posts`, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching of response
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        const data = await response.json();
        setMyPosts(data);
      };

      fetchPosts();
    }
  }, [session?.user?.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this Advice?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading text until session is determined
  }

  if (!session) {
    return <div>Please sign in to view your profile.</div>; // If not signed in, show a prompt
  }

  return (
    <div className="">
      <Profile
        name="My"
        desc="Welcome to your personalized profile page. Share your exceptional Wisdom and inspire others with the power of your imagination"
        data={myPosts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Image
        src="/assets/images/6r.png"
        alt="logo"
        width={300}
        height={300}
        className="object-contain place-items-end"
      />
    </div>
  );
};

export default MyProfile;
