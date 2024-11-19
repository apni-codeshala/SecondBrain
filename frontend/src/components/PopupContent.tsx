import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import axios from "axios";

export function PopupComponent({
  contentModal,
  setContentModal,
}: {
  contentModal: boolean;
  setContentModal: (condition: false) => void;
}) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("Image");
  const [tags, setTags] = useState<string[]>([]);

  const addTagInput = () => {
    setTags([...tags, ""]);
  };

  const removeTagInput = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTagValue = (value: string, index: number) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      title,
      link,
      type: type.toLowerCase(),
      tags,
    };

    try {
      await axiosInstance.post("/content", payload);
      alert("Content added successfully!");
      setContentModal(false);
      setTitle("");
      setLink("");
      setType("Image");
      setTags([]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred while submitting the form.");
      }
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Modal
        show={contentModal}
        size="md"
        popup
        onClose={() => setContentModal(false)}
        initialFocus={titleInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add new content
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Content title" />
                </div>
                <TextInput
                  id="title"
                  ref={titleInputRef}
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="link" value="Content link" />
                </div>
                <TextInput
                  id="link"
                  type="text"
                  placeholder="Enter link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="type" value="Select content type" />
                </div>
                <Select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option>Image</option>
                  <option>Video</option>
                  <option>Article</option>
                  <option>Audio</option>
                  <option>PDF</option>
                  <option>Drive</option>
                </Select>
              </div>
              <div>
                <Label value="Tags" />
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <TextInput
                      value={tag}
                      placeholder={`Tag #${index + 1}`}
                      onChange={(e) => updateTagValue(e.target.value, index)}
                      className="mr-2"
                      required
                    />
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => removeTagInput(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  className="mt-2"
                  onClick={addTagInput}
                  color="success"
                  size="sm"
                  type="button"
                >
                  Add Tag
                </Button>
              </div>
              <div className="w-full">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
