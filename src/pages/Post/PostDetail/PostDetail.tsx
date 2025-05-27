import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  IconButton,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// 타입 정의
interface Post {
  id: number;
  title: string;
  tradeType: "sell" | "buy";
  category: string;
  modelNumber: string;
  modelName: string;
  brand: string;
  minPrice: number;
  description: string;
  quantity: number;
  images: string[];
  isScraped: boolean;
  author: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  isAuthor: boolean;
  defectAnswers: Record<string, string>;
  createdAt: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // Mock data - 실제로는 API에서 받아와야 함
  const dummyPosts: Post[] = [
    {
      id: 1,
      title: "[판매] 삼성 냉장고 팝니다",
      tradeType: "sell",
      category: "refrigerator",
      modelName: "RM70F90",
      modelNumber: "",
      brand: "삼성",
      minPrice: 500000,
      description: "1년 사용한 냉장고입니다. 상태 매우 좋습니다.",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/refrigerator.svg`],
      isScraped: false,
      author: {
        id: 1,
        nickname: "판매자1",
        profileImage: "",
      },
      isAuthor: true,
      defectAnswers: {
        "냉각 기능에 문제가 있나요?": "정상입니다.",
        "문이 제대로 닫히나요?": "네.",
        "내부 부품이 모두 있나요?": "네, 다 있습니다.",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "[판매] LG 통돌이 세탁기 급처",
      tradeType: "sell",
      category: "washer",
      modelName: "CAE7895SI",
      modelNumber: "",
      brand: "LG",
      minPrice: 150000,
      description: "",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/washer.svg`],
      isScraped: true,
      author: {
        id: 1,
        nickname: "판매자1",
        profileImage: "",
      },
      isAuthor: true,
      defectAnswers: {
        "세탁 기능에 문제가 있나요?": "정상 작동합니다.",
        "배수가 잘 되나요?": "네, 잘 됩니다.",
        "소음이 심한가요?": "조금 있습니다.",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "[판매] 스탠드 에어컨 판매합니다",
      tradeType: "sell",
      category: "aircon",
      modelName: "E5ZSC",
      modelNumber: "",
      brand: "",
      minPrice: 350000,
      description: "",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/airconditioner.svg`],
      isScraped: false,
      author: {
        id: 2,
        nickname: "판매자2",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {
        "냉방 기능에 문제가 있나요?": "정상입니다.",
        "실외기 상태는 어떤가요?": "깨끗합니다.",
        "필터 상태는 어떤가요?": "최근 교체했습니다.",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: "[판매] 건조기 팔아요 (2년 사용)",
      tradeType: "sell",
      category: "washer",
      modelName: "333CDO23",
      modelNumber: "",
      brand: "",
      minPrice: 400000,
      description: "",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/washer.svg`],
      isScraped: true,
      author: {
        id: 3,
        nickname: "판매자3",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: "[구매] 삼성 비스포크 냉장고 구매",
      tradeType: "buy",
      category: "refrigerator",
      modelName: "",
      modelNumber: "",
      brand: "삼성",
      minPrice: 0,
      description: "중고 냉장고 구매 원합니다. 상태 좋은 것만 구매합니다.",
      quantity: 1,
      images: [],
      isScraped: false,
      author: {
        id: 4,
        nickname: "구매자1",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      title: "[구매] 벽걸이 에어컨 구매",
      tradeType: "buy",
      category: "aircon",
      modelName: "",
      modelNumber: "",
      brand: "",
      minPrice: 0,
      description: "",
      quantity: 1,
      images: [],
      isScraped: false,
      author: {
        id: 5,
        nickname: "구매자2",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 7,
      title: "[구매] LG 트롬 세탁기 구매",
      tradeType: "buy",
      category: "washer",
      modelName: "",
      modelNumber: "",
      brand: "LG",
      minPrice: 0,
      description: "",
      quantity: 1,
      images: [],
      isScraped: true,
      author: {
        id: 6,
        nickname: "구매자3",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 8,
      title: "[판매] 삼성 냉장고 (새제품)",
      tradeType: "sell",
      category: "refrigerator",
      modelName: "OWJ70002",
      modelNumber: "",
      brand: "삼성",
      minPrice: 650000,
      description: "나온지 얼마 안된 모델입니다.",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/refrigerator.svg`],
      isScraped: false,
      author: {
        id: 7,
        nickname: "판매자4",
        profileImage: "",
      },
      isAuthor: true,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
    },
  ];

  // localStorage에서 데이터 가져오기 및 상태 초기화
  useEffect(() => {
    // const savedPosts = localStorage.getItem("posts"); // 이 줄은 주석 처리하거나 삭제합니다.
    // if (savedPosts) { // 이 줄은 주석 처리하거나 삭제합니다.
    //   try { // 이 줄은 주석 처리하거나 삭제합니다.
    //     setPosts(JSON.parse(savedPosts)); // 이 줄은 주석 처리하거나 삭제합니다.
    //   } catch (error) { // 이 줄은 주석 처리하거나 삭제합니다.
    //     console.error("Failed to parse posts from localStorage:", error); // 이 줄은 주석 처리하거나 삭제합니다.
    //     setPosts(dummyPosts); // 파싱 실패 시 더미 데이터 사용 // 이 줄은 주석 처리하거나 삭제합니다.
    //     // localStorage.setItem("posts", JSON.stringify([])); // 유효하지 않은 데이터 덮어쓰기 (선택 사항) // 이 줄은 주석 처리하거나 삭제합니다.
    //   } // 이 줄은 주석 처리하거나 삭제합니다.
    // } else { // 이 줄은 주석 처리하거나 삭제합니다.
    //   setPosts(dummyPosts); // localStorage에 데이터가 없으면 더미 데이터 사용 // 이 줄은 주석 처리하거나 삭제합니다.
    // }
    setPosts(dummyPosts); // dummyPosts를 직접 사용하도록 수정
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // id에 해당하는 게시물 찾기
  const post = useMemo(() => {
    const numericId = Number(id); // id를 숫자로 변환
    // posts 배열의 각 항목의 id도 숫자로 변환하여 비교
    const foundPost = posts.find((p: Post) => Number(p.id) === numericId);

    // 찾은 게시물이 없을 경우 fallback 객체 사용
    return (
      foundPost || {
        id: Number(id),
        title: "게시물을 찾을 수 없습니다",
        tradeType: "sell",
        category: "알 수 없음",
        modelNumber: "알 수 없음",
        modelName: "알 수 없음",
        brand: "알 수 없음",
        minPrice: 0,
        description: "해당 게시물을 찾을 수 없습니다.",
        quantity: 0,
        images: [],
        isScraped: false,
        author: {
          id: 0,
          nickname: "알 수 없음",
          profileImage: "/images/refrigerator.svg",
        },
        isAuthor: false,
        defectAnswers: {},
        createdAt: new Date().toISOString(),
      }
    );
  }, [id, posts]); // id 또는 posts 상태가 변경될 때 다시 계산

  useEffect(() => {
    // 디버깅을 위한 로그 추가
    console.log("PostDetail Debug Info:");
    console.log("  useParams id:", id);
    console.log("  posts state:", posts);
    console.log("  matched post:", post);

    window.scrollTo(0, 0);
  }, [id, posts, post]); // id, posts, post 상태가 변경될 때마다 로그 출력

  const [isScraped, setIsScraped] = useState(post.isScraped || false);

  // post 상태가 변경될 때마다 isScraped 상태 업데이트
  useEffect(() => {
    setIsScraped(post.isScraped || false);
  }, [post]);

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
  const initial = post?.author?.nickname ? post.author.nickname.charAt(0) : "?";

  const handleScrap = () => {
    const updatedPosts = posts.map((p: Post) =>
      p.id === Number(id) ? { ...p, isScraped: !p.isScraped } : p
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setIsScraped(!isScraped);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
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

  const handleCommentDelete = (commentId: number) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const handleChat = () => {
    if (post.author) {
      navigate(`/chat/${post.author.id}`);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    handleMenuClose();
    // TODO: 글 수정 페이지로 이동 로직 구현 (게시물 ID 전달 필요)
    console.log("글 수정 클릭됨");
    // 글 수정 페이지로 이동, 게시물 ID를 state로 전달
    navigate(`/post/modify/${post.id}`);
  };

  const handleDeletePost = () => {
    handleMenuClose();
    // 삭제 확인 메시지 표시
    const isConfirmed = window.confirm("정말로 이 게시물을 삭제하시겠습니까?");

    if (isConfirmed) {
      // localStorage에서 게시물 삭제
      const savedPosts = localStorage.getItem("posts");
      const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
      const updatedPosts = posts.filter((p) => p.id !== post.id);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      // posts 상태 업데이트 (UI 반영)
      setPosts(updatedPosts); // useMemo로 인해 post도 업데이트됨

      // 게시물 목록 페이지로 이동
      navigate("/post/list");
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      refrigerator: "냉장고",
      washer: "세탁기",
      dishwasher: "식기세척기",
      aircon: "에어컨",
    };
    return categories[category] || category;
  };

  return (
    <Container maxWidth="sm" sx={{ pb: "76px" }}>
      {/* 헤더 */}
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          mb: 2,
          borderRadius: 0,
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
        elevation={0}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.title}
          </Typography>
        </Stack>
        {post.isAuthor ? (
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenu ? "long-menu" : undefined}
            aria-expanded={openMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleScrap} size="small">
            {isScraped ? (
              <FavoriteIcon color="primary" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        )}
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "10ch",
            },
          }}
        >
          <MenuItem onClick={handleEditPost}>수정</MenuItem>
          <MenuItem onClick={handleDeletePost}>삭제</MenuItem>
        </Menu>
      </Paper>

      <Stack spacing={3}>
        {/* 이미지 섹션 */}
        {post?.images?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {post.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ))}
          </Box>
        )}

        {/* 정보 섹션 */}
        <Stack spacing={3}>
          {/* 제목 및 정보 */}
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              {post.tradeType === "sell" && post.minPrice > 0 && (
                <Typography variant="h6" color="primary">
                  {post.minPrice.toLocaleString()}원
                </Typography>
              )}
              {post.tradeType === "buy" && post.quantity > 0 && (
                <Typography variant="h6" color="primary">
                  수량: {post.quantity}개
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* 상품 정보 (판매일 때만) */}
          {post.tradeType === "sell" && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                제품 정보
              </Typography>
              {(post.modelNumber || post.modelName || post.brand) && (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      모델 번호
                    </Typography>
                    <Typography>{post.modelNumber || "-"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      모델명
                    </Typography>
                    <Typography>{post.modelName || "-"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      브랜드
                    </Typography>
                    <Typography>{post.brand || "-"}</Typography>
                  </Box>
                </Stack>
              )}
              {!(post.modelNumber || post.modelName || post.brand) && (
                <Typography variant="body2" color="text.secondary">
                  제품 정보가 없습니다.
                </Typography>
              )}
            </Paper>
          )}

          {/* 제품 상태 확인 (판매 & defectAnswers가 있을 때만) */}
          {post.tradeType === "sell" && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                제품 상태 확인
              </Typography>
              {Object.keys(post.defectAnswers || {}).length > 0 ? (
                <Stack spacing={2}>
                  {Object.entries(
                    post.defectAnswers as Record<string, string>
                  ).map(([question, answer]) => (
                    <Box key={question}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {question}
                      </Typography>
                      <Typography>{answer || "-"}</Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  제품 상태 확인 정보가 없습니다.
                </Typography>
              )}
            </Paper>
          )}

          {/* 상세 설명 */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              상세 설명
            </Typography>
            <Typography>
              {post.description || "상세 설명이 없습니다."}
            </Typography>
          </Paper>
        </Stack>

        {/* 판매자 정보 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: profileColor,
                width: 40,
                height: 40,
              }}
            >
              {initial}
            </Avatar>
            <Typography>{post.author.nickname}</Typography>
          </Stack>
          <Button variant="contained" onClick={handleChat}>
            채팅하기
          </Button>
        </Stack>

        {/* 댓글 섹션 */}
        <Typography variant="subtitle1" gutterBottom>
          댓글
        </Typography>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요 (최대 1000자)"
              inputProps={{ maxLength: 1000 }}
              size="small"
            />
            <Button type="submit" variant="contained">
              등록
            </Button>
          </Stack>
        </Box>
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Box key={comment.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{comment.author}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
                {comment.author === "현재 사용자" && (
                  <IconButton
                    size="small"
                    onClick={() => handleCommentDelete(comment.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {comment.content}
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>

        {/* 하단 버튼 */}
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            borderRadius: 0,
            borderTop: "1px solid",
            borderColor: "grey.200",
          }}
          elevation={0}
        >
          <Stack direction="row" spacing={2}>
            {!post.isAuthor && (
              <>
                <Button
                  variant="outlined"
                  startIcon={
                    isScraped ? <FavoriteIcon /> : <FavoriteBorderIcon />
                  }
                  onClick={handleScrap}
                  fullWidth
                >
                  {isScraped ? "스크랩 완료" : "스크랩"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  onClick={handleChat}
                  fullWidth
                >
                  채팅하기
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default PostDetail;
