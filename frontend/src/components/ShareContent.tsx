import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import axiosInstance from "../config/axiosInstance";

interface ContentCardProps {
  title: string;
  link: string;
  type: string;
  tags: string[];
  createdAt: string;
}

const ShareContent: React.FC<ContentCardProps> = ({
  title,
  link,
  type,
  tags,
  createdAt,
}) => {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [metadataTitle, setMetadataTitle] = useState<string>(title);
  const [description, setDescription] = useState<string>("");

  const loadThumbnail = async () => {
    try {
      const response = await axiosInstance.post("content/metadata", {
        url: link,
      });
      if (response.data.success) {
        const { title, description, image } = response.data.data;
        setMetadataTitle(title || metadataTitle);
        setDescription(description || "");
        setThumbnail(image.images[0].url || "");
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  useEffect(() => {
    loadThumbnail();
  }, [link]);

  return (
    <Card className="bg-gray-50">
      {thumbnail && (
        <img
          src={thumbnail}
          alt="Thumbnail"
          className="w-full h-48 object-contain rounded-t-lg"
        />
      )}
      <div className="p-4">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Type: <span className="capitalize">{type}</span>
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300 mt-2">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description || "No description available."}
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300 mt-2">
          Tags:{" "}
          {tags.length > 0 ? (
            <span className="inline-flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
                >
                  #{tag}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-gray-500">No tags</span>
          )}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-3"
        >
          <FaLink /> Visit Link
        </a>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            Created At: {new Date(createdAt).toLocaleDateString("en-US")}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ShareContent;
