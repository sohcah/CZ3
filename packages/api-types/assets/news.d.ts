import { EndpointBase, Response } from "../common";

export interface AssetsNewsAsset {
  id: string;
  show_at: string;
  title: string;
  image_url: string;
  blog_url: string;
}

export interface AssetsNews extends EndpointBase {
  path: "assets/news";
  params: {
    per_page?: number;
    current_page?: number;
  };
  response: Response<{
    data: AssetsNewsAsset[];
    meta: {
      current_page: number;
      per_page: number;
      has_more: 1 | 0;
    };
  }>;
}
