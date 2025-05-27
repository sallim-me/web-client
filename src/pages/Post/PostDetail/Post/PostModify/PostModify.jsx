import React from "react";
import { useParams } from "react-router-dom";
import PostCreate from "../PostCreate/PostCreate";

const PostModify = () => {
  const { id } = useParams();
  const savedPosts = localStorage.getItem("posts");
  const posts = savedPosts ? JSON.parse(savedPosts) : [];
  const post = posts.find((p) => p.id === Number(id));

  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  // tradeType은 type 필드로부터 변환
  const initialData = {
    ...post,
    tradeType: post.type === "sell" ? "판매" : "구매",
    images: [], // 이미지 재업로드 필요 시 빈 배열
    buyingInfo: post.buyingInfo || {
      quantity: "",
      desiredPrice: "",
      condition: "",
    },
  };

  return <PostCreate isEditMode={true} initialData={initialData} postId={id} />;
};

export default PostModify;
