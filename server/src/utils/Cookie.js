

function  clearRefreshTokenCookie(res) {
   res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/api/auth",
  });
}
 

module.exports = 

    clearRefreshTokenCookie 