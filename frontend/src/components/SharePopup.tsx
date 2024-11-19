import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import UserContext from "../utils/UserContext";

interface SharePopupProps {
  openModal: boolean;
  setOpenModal: (condition: boolean) => void;
}

export function SharePopup({ openModal, setOpenModal }: SharePopupProps) {
  const { user, setUser } = useContext(UserContext);

  const [isSharingOn, setIsSharingOn] = useState<boolean>(user.share);
  const [contentLink, setContentLink] = useState<string>("");

  const handleToggleSharing = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsSharingOn(e.target.checked);
    const url = e.target.checked ? "/brain/share" : "/brain/shareoff";

    try {
      const response = await axiosInstance.patch(url);
      if (response.status === 200) {
        if (e.target.checked) {
          console.log(response.data);
          const tempUser = { ...user, share: true };
          setUser(tempUser);
          setContentLink(
            "http://localhost:5173/brain" + response.data.link || "",
          );
        } else {
          const tempUser = { ...user, share: false };
          setUser(tempUser);
          setContentLink("");
        }
      } else {
        console.log("Failed to update sharing status");
      }
    } catch (error) {
      console.error("Error updating sharing status", error);
    }
  };

  const handleCopyToClipboard = () => {
    if (contentLink) {
      navigator.clipboard
        .writeText(contentLink)
        .then(() => {
          alert("Content link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sharing Options
            </h3>
            <div className="mb-4">
              <Checkbox
                id="shareToggle"
                checked={isSharingOn}
                onChange={handleToggleSharing}
              />
              <Label htmlFor="shareToggle" className="ml-2">
                Enable sharing
              </Label>
            </div>

            {isSharingOn && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="contentLink" value="Content Link" />
                </div>
                <div className="flex items-center">
                  <TextInput
                    id="contentLink"
                    value={contentLink}
                    readOnly
                    className="mr-2"
                  />
                  <Button onClick={handleCopyToClipboard}>Copy</Button>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
