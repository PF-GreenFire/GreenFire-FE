/**
 * 피드 게시글 공유
 * Web Share API 지원 시 네이티브 공유, 미지원 시 클립보드 복사
 * @returns {Promise<boolean>} 클립보드 복사 여부 (true면 토스트 표시 필요)
 */
export const shareFeedPost = async (post) => {
  const url = `${window.location.origin}/feed/${post.postCode}`;
  const shareData = {
    title: `${post.nickname}님의 피드`,
    text: post.postContent?.substring(0, 100) || "",
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return false; // 네이티브 공유 사용 → 토스트 불필요
    } catch (err) {
      // 사용자가 공유 취소한 경우
      if (err.name === "AbortError") return false;
    }
  }

  // fallback: 클립보드 복사
  try {
    await navigator.clipboard.writeText(url);
    return true; // 토스트 표시 필요
  } catch {
    // 클립보드 API 미지원 시 수동 복사
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  }
};
