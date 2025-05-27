import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as S from "./styled";
import scrapOnIcon from "../../../assets/scrap-on.svg";
import scrapOffIcon from "../../../assets/scrap-off.svg";
import backIcon from "../../../assets/back.svg";
import dotsIcon from "../../../assets/dots.svg";
import Button from "../../../components/common/Button/Button";

const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [postStatus, setPostStatus] = useState("available"); // 'available' 또는 'sold'
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - 실제로는 API에서 받아와야 함
  const savedPosts = localStorage.getItem("posts");
  const posts = savedPosts ? JSON.parse(savedPosts) : [];

  // post 데이터를 찾고 초기화
  const post = useMemo(() => {
    const foundPost = posts.find((p) => p.id === Number(id)) || {
      id: Number(id),
      title: "게시물을 찾을 수 없습니다",
      author: "알 수 없음",
      authorId: "unknown",
      isAuthor: false,
      type: "sell",
      status: "available",
      category: "알 수 없음",
      images: [], // images 배열 기본값 설정
      imageUrl: null, // imageUrl 기본값 설정
      modelName: "알 수 없음",
      specifications: "", // 문자열로 변경 (PostCreate와 일관성 유지)
      defectQuestions: {},
      description: "해당 게시물을 찾을 수 없습니다.",
      price: 0,
      buyingInfo: { quantity: "", desiredPrice: "", condition: "" },
      createdAt: new Date().toISOString(),
    };

    // images 배열이 없으면 imageUrl로 images 배열 생성 (하위 호환성)
    if (!Array.isArray(foundPost.images) && foundPost.imageUrl) {
      foundPost.images = [foundPost.imageUrl];
    } else if (!Array.isArray(foundPost.images)) {
      foundPost.images = [];
    }

    return foundPost;
  }, [id, posts]); // id 또는 posts가 변경될 때만 재계산

  useEffect(() => {
    window.scrollTo(0, 0);
    // 게시물 상태를 post 데이터에서 초기화
    setPostStatus(post.status || "available");
  }, [post]); // post 데이터가 로드/변경될 때만 실행

  const [isScraped, setIsScraped] = useState(post.isScraped || false);

  const getRandomColor = () => {
    const colors = [
      "#FF9AA2",
      "#FFB7B2",
      "#FFDAC1",
      "#E2F0CB",
      "#B5EAD7",
      "#C7CEEA",
      "#9FB3DF",
      "#B8B3E9",
      "#D4A5A5",
      "#9CADCE",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const profileColor = useMemo(() => getRandomColor(), []);
  const initial = post?.author ? post.author.charAt(0) : "?";

  const handleScrap = () => {
    const updatedPosts = posts.map((p) =>
      p.id === Number(id) ? { ...p, isScraped: !p.isScraped } : p
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setIsScraped(!isScraped);
  };

  const handleStatusChange = () => {
    const newStatus = postStatus === "available" ? "sold" : "available";
    setPostStatus(newStatus);

    // 제목에서 기존 태그 제거
    const cleanTitle = post.title.replace(
      /^\[(판매|판매완료|구매|구매완료)\] /,
      ""
    );

    // 새로운 태그 생성
    const newTag =
      post.type === "sell"
        ? newStatus === "available"
          ? "[판매]"
          : "[판매완료]"
        : newStatus === "available"
        ? "[구매]"
        : "[구매완료]";

    // 새로운 제목 생성
    const newTitle = `${newTag} ${cleanTitle}`;

    // 실제로는 API 호출로 상태를 변경해야 함
    const updatedPosts = posts.map((p) =>
      p.id === Number(id)
        ? {
            ...p,
            status: newStatus,
            title: newTitle,
          }
        : p
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const handleDelete = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const updatedPosts = posts.filter((p) => p.id !== Number(id));
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      navigate("/post/list");
    }
  };

  const handleEdit = () => {
    navigate(`/post/modify/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && comment.length <= 1000) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          author: "현재 사용자",
          content: comment,
          createdAt: new Date().toISOString(),
        },
      ]);
      setComment("");
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={handleBack}>
          <img src={backIcon} alt="뒤로 가기" />
        </S.BackButton>
        <S.Title>{post.title}</S.Title>
        {post.isAuthor ? (
          <div style={{ position: "relative" }}>
            <S.ScrapButton as="button" onClick={() => setShowMenu((v) => !v)}>
              <img src={dotsIcon} alt="더보기" />
            </S.ScrapButton>
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 40,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    padding: "12px 24px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    minWidth: 60,
                    textAlign: "center",
                  }}
                  onClick={handleEdit}
                >
                  수정
                </div>
                <div
                  style={{
                    padding: "12px 24px",
                    cursor: "pointer",
                    color: "#ff4444",
                    whiteSpace: "nowrap",
                    minWidth: 60,
                    textAlign: "center",
                  }}
                  onClick={handleDelete}
                >
                  삭제
                </div>
              </div>
            )}
          </div>
        ) : (
          <S.ScrapButton onClick={handleScrap}>
            <img src={isScraped ? scrapOnIcon : scrapOffIcon} alt="스크랩" />
          </S.ScrapButton>
        )}
      </S.Header>

      <S.Content>
        <S.ImageSection style={{ position: "relative" }}>
          {post.images && post.images.length > 0 ? (
            <>
              <img
                src={
                  post.images[currentImageIndex].url ||
                  post.images[currentImageIndex]
                }
                alt={`이미지${currentImageIndex + 1}`}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
              {post.images.length > 1 && (
                <>
                  {/* 좌우 네비게이션 버튼 */}
                  <button
                    onClick={handlePrevImage}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10px",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={handleNextImage}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                  >
                    &gt;
                  </button>

                  {/* 페이지네이션 */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      zIndex: 10,
                    }}
                  >
                    {currentImageIndex + 1}/{post.images.length}
                  </div>
                </>
              )}
            </>
          ) : post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt="대표 이미지"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f0f0f0",
                color: "#666",
              }}
            >
              이미지가 없습니다
            </div>
          )}
        </S.ImageSection>

        <S.InfoSection>
          {post.type === "buy" ? (
            <>
              <div style={{ marginBottom: "8px" }}>
                수량: {0}/{post.buyingInfo?.quantity || 0}
              </div>
              <div style={{ marginBottom: "8px" }}>
                희망 가격:{" "}
                {post.buyingInfo?.desiredPrice
                  ? Number(post.buyingInfo.desiredPrice).toLocaleString()
                  : 0}
                원
              </div>
              <div style={{ marginBottom: "8px" }}>
                상세 정보: {post.description}
              </div>
            </>
          ) : (
            <>
              <S.Price>
                <span>가격</span>
                <span>{post.price.toLocaleString()}원</span>
              </S.Price>
              <S.AuthorSection>
                <S.AuthorInfo>
                  <S.ProfileInitial backgroundColor={profileColor}>
                    {initial}
                  </S.ProfileInitial>
                  <S.Author>{post.author}</S.Author>
                </S.AuthorInfo>
                {post.isAuthor ? (
                  <Button
                    size="small"
                    variant={postStatus === "available" ? "1" : "2"}
                    onClick={handleStatusChange}
                  >
                    {post.type === "sell"
                      ? postStatus === "available"
                        ? "판매 완료"
                        : "판매중으로 변경"
                      : postStatus === "available"
                      ? "구매 완료"
                      : "구매중으로 변경"}
                  </Button>
                ) : (
                  <Button
                    size="big"
                    variant="1"
                    onClick={() => navigate(`/chat/${post.authorId}`)}
                  >
                    채팅하기
                  </Button>
                )}
              </S.AuthorSection>
              <S.SpecificationSection>
                <S.Label>제품 정보</S.Label>
                <S.SpecificationText>
                  {post?.specifications &&
                  Object.values(post.specifications).some(
                    (value) => value && value !== "알 수 없음"
                  ) ? (
                    <p>{post.specifications}</p>
                  ) : null}
                </S.SpecificationText>
              </S.SpecificationSection>
              <S.DefectSection>
                <S.Label>상태 정보</S.Label>
                <S.DefectGrid>
                  <S.DefectItem>
                    <span>냉각 기능</span>
                    <span>
                      {post?.defectQuestions?.cooling || "알 수 없음"}
                    </span>
                  </S.DefectItem>
                  <S.DefectItem>
                    <span>소음</span>
                    <span>{post?.defectQuestions?.noise || "알 수 없음"}</span>
                  </S.DefectItem>
                  <S.DefectItem>
                    <span>외관</span>
                    <span>
                      {post?.defectQuestions?.exterior || "알 수 없음"}
                    </span>
                  </S.DefectItem>
                </S.DefectGrid>
              </S.DefectSection>
              <S.Description>
                <S.Label>상세 설명</S.Label>
                <S.DescriptionText>{post.description}</S.DescriptionText>
              </S.Description>
            </>
          )}
        </S.InfoSection>

        <S.CommentSection>
          <S.Label>댓글</S.Label>
          <S.CommentForm onSubmit={handleCommentSubmit}>
            <S.CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              placeholder="댓글을 입력하세요 (최대 1000자)"
            />
            <Button type="submit" size="small" variant="1">
              등록
            </Button>
          </S.CommentForm>
          <S.CommentList>
            {comments.map((comment) => (
              <S.CommentItem key={comment.id}>
                <S.CommentHeader>
                  <S.CommentAuthor>{comment.author}</S.CommentAuthor>
                  <S.CommentDate>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </S.CommentDate>
                </S.CommentHeader>
                <S.CommentContent>{comment.content}</S.CommentContent>
                {comment.author === "현재 사용자" && (
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      onClick={() => handleCommentDelete(comment.id)}
                      style={{
                        color: "#999",
                        fontSize: "13px",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      삭제
                    </span>
                  </div>
                )}
              </S.CommentItem>
            ))}
          </S.CommentList>
        </S.CommentSection>
      </S.Content>
    </S.Container>
  );
};

export default PostDetail;
