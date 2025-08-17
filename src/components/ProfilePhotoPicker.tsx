import { useRef } from "react";

import { LuTrash, LuUpload, LuUser } from "react-icons/lu";

type Props = {
  image: string;
  handleImageChange: (value: string) => void;
};
const ProfilePhotoPicker = ({ image, handleImageChange }: Props) => {
  const inputRef = useRef<any>(null);

  const imageUpload = (e: any) => {
    let value = e.target.files[0];
    if (value) {
    handleImageChange(e.target.files[0]);
    }
  };
  const handleClick = () => {
    inputRef?.current?.click();
  };

  const handleRemove = () => {
    handleImageChange("");
  };
  console.log("image", image);
  return (
    <div className="flex justify-center mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/"
        className="hidden"
        onChange={imageUpload}
      />

      {!image ? (
        <div className="w-20 h-20 items-center justify-center bg-purple-100 rounded-full relative flex">
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            onClick={handleClick}
            className="w-8 h-8 flex items-center justify-center  rounded-full absolute -bottom-2 -right-1 bg-primary  text-white "
          >
            <LuUpload className="" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={image ? image : undefined}
            className="w-20 h-20 object-cover rounded-full"
          />
          <button
            onClick={handleRemove}
            className="w-8 h-8 flex items-center justify-center  rounded-full absolute -bottom-2 -right-1 bg-red-500  text-white"
          >
            <LuTrash className="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoPicker;
