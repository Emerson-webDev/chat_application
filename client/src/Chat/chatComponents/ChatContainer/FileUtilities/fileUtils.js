// video type
export const isVideo = (file) => {
  return file.startsWith("video/");
};
// allowed files size
export const isFileSizeBelowLimit = (file, maxSizeInBytes) => {
  return file.size <= maxSizeInBytes;
};

// image type
export const isImageType = (file) => {
  return file.startsWith("image/");
};

// application type
//ex. pdf/docx
export const isFileType = (file) => {
  return file.startsWith("application/");
};

export const messageCurrentUserStatus = (currentUser,file) => {
  return currentUser && file
    ? file[0]?.type?.startsWith("image/")
      ? "You sent photo"
      : file[0]?.type?.startsWith("application/")
      ? "You sent file"
      : "You sent video"
    : "You received " +
      (file[0]?.type?.startsWith("image/")
        ? "photo"
        : file[0]?.type?.startsWith("application/")
        ? "file"
        : "video")
};
export const messageDataUserStatus = (dataUser,file) => {
  return dataUser && file
    ? file[0]?.type?.startsWith("image/")
      ? "You recieved photo"
      : file[0]?.type?.startsWith("application/")
      ? "You recieved file"
      : "You recieved video"
    : "You sent " +
      (file[0]?.type?.startsWith("image/")
        ? "photo"
        : file[0]?.type?.startsWith("application/")
        ? "file"
        : "video")
};
