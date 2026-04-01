export const formatUserResponse = (user) => ({
  ...user,
  profilePictureUrl: user.profilePictureUrl
    ? `${user.profilePictureUrl}?t=${user.updatedAt.toISOString()}`
    : null,
});
