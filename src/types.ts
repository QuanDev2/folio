export interface Photo {
  id: string,
  url: string,
  alt?: string,
  caption?: string,
  authorId?: string,
  tags?: string[]
  metaData?: PhotoMetaData,
}

export interface PhotoMetaData {
  camera?: string,
  lens?: string,
  aperture?: string,
  shutterSpeed?: string,
  iso?: number,
  focalLength?: string,
  location?: string,
  dateTaken?: string,
}

export interface User {
  id: string,
  name: string,
  email: string,
  profilePictureUrl?: string,
  bio?: string,
}

export interface Post {
  id: string,
  title: string,
  slug: string,
  authorId: string,
  published: boolean,
  content: string,
  coverPhotoId: string,
  photos: Photo[]
}