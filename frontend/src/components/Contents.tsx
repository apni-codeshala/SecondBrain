import React, { useEffect, useState } from "react";
import Content from "./Content";
import axiosInstance from "../config/axiosInstance";

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

const Contents: React.FC = () => {
  const [contentData, setContentData] = useState<ContentData[]>([]);

  const loadContent = async () => {
    try {
      const response = await axiosInstance.get("content");
      if (response.data.success) {
        setContentData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`content/${id}`);
      if (response.data.success) {
        setContentData((prev) => prev.filter((content) => content._id !== id));
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10">
      {contentData.length > 0 ? (
        contentData.map((content) => (
          <Content
            key={content._id}
            title={content.title}
            link={content.link}
            type={content.type}
            tags={content.tags.map((tag) => tag.title)}
            createdAt={content.createdAt}
            onDelete={() => handleDelete(content._id)}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No content available
        </p>
      )}
    </div>
  );
};

export default Contents;
