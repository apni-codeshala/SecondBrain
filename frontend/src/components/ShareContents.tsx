import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import ShareContent from "./ShareContent";

interface Tag {
  _id: string;
  title: string;
}

interface ContentData {
  _id: string;
  link: string;
  type: string;
  title: string;
  tags: Tag[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function ShareContents() {
  const { link } = useParams<{ link: string }>();
  const [contentData, setContentData] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      if (!link) return;

      try {
        const response = await axiosInstance.get(`/brain/${link}`);
        if (response.status === 200) {
          setContentData(response.data.data);
        } else {
          setError("Content not found");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [link]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="text-center font-semibold text-3xl pt-5">
            Other User Shared Content
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10">
            {contentData?.length > 0 ? (
              contentData.map((content) => (
                <ShareContent
                  key={content._id}
                  title={content.title}
                  link={content.link}
                  type={content.type}
                  tags={content.tags.map((tag) => tag.title)}
                  createdAt={content.createdAt}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No content available
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
