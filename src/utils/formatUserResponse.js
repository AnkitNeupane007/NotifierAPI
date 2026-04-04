// Add the fake query parameter to the profile picture URL to
// force the client to fetch the updated image

export const formatUserResponse = (user) => ({
  ...user,
  profilePictureUrl: user.profilePictureUrl
    ? `${user.profilePictureUrl}?t=${user.updatedAt.toISOString()}`
    : null,
});
