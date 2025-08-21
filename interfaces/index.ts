export interface VideoDetails {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  statastics: any;
}

export interface Reply {
  id: string;
  snippet: {
    authorDisplayName: string;
    authorChannelUrl: string;
    authorProfileImageUrl: string;
    channelId: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
    textDisplay: string;
    textOriginal: string;
    parentId: string;
    canRate: boolean;
    viewerRating: string;
  };
}
