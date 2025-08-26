export const imageUpload = (file, folder = "users") => {
    const fileExt = file.name.split(".").pop();
    const randomString = Math.random().toString(36).substring(2, 30).toUpperCase();
    const fileName = `${randomString}.${fileExt}`;
    
    file.mv(`public/images/${folder}/${fileName}`);
    return fileName;
  };