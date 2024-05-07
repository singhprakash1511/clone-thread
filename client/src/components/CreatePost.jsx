import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector ,useDispatch} from "react-redux";
import { IoCreateOutline } from "react-icons/io5";
import { setPost } from "../Redux/Slices/postSlices";

const CreatePost = () => {
  const { token } = useSelector((state) => state.user);
  const {posts} = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const user = token.user;
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postText, setPostText] = useState("");
  const [formData, setFormData] = useState({})

  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setPostText(inputText);
  };


  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // if (file) {
    //   // Preview the image
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setImagePreview(reader.result);
    //   };
    //    reader.readAsDataURL(file);
    // }else{
    //     toast.error("Please select an image file");
    //     setImagePreview(null)
    // }
    if(file){
      setImageFile(file);
      previewFile(file)
  }
  };

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        setImagePreview(reader.result)
    }
}

  const clickHandler = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };
 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/posts/create", {
          postedBy: user._id,
          text: postText,
          img: imageFile, 
      });
      const data = res.data;
      if (data.error) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      dispatch(setPost([data, ...posts]));
      setImagePreview(null);
      setPostText("");
      setIsOpen(!isOpen)
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    if(imageFile) {
      previewFile(imageFile)
  }
  }, [imageFile]);

  return (
    <div >
      <div
        onClick={clickHandler}
        className="flex items-center text-[20px] font-bold justify-center gap-3 cursor-pointer"
      >
        <IoCreateOutline className="text-[29px]"/>
        {isOpen && (
          <div className="absolute bg-gray-100 z-20  w-[550px] left-[50%px] top-[80px] flex items-center flex-col gap-10 rounded-xl h-[550px]">
            <h1 className="border-b-[1px] w-full text-center border-black py-2 text-xl font-medium">
              Create new post
            </h1>

            <form
            onSubmit={handleSubmit}
              className="flex flex-col w-full h-full m-auto items-center gap-8 "
            >
              <div className="w-full h-[40%] flex items-center justify-center">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current.click();
                  }}
                  className="bg-[#1876f2d0] hover:bg-[#1877F2] text-white py-[6px] px-[6px] font-medium rounded-md cursor-pointer"
                >
                  Select from computer
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="img"
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleImageChange}
                />
              </div>

              <div className="w-full h-[50%] flex items-center">
                <textarea
                  placeholder="Write a caption.."
                  name="postText"
                  value={postText}
                  onChange={handleTextChange}
                  rows={4}
                  cols={50}
                  className="w-[90%] h-[80%] outline-none p-5 rounded-lg text-black  m-auto resize-none"
                />
              </div>

              <button type="submit" className=" text-[18px] text-[#1877F2] bg-white py-1 px-3 rounded-lg mb-2">
                post
              </button>
            </form>
          </div>
        )}
        {imagePreview ? (
          <div className="contents">
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute z-50 right-[542px] w-[400px] top-[140px] h-[245px]"
            />
            <span
              className="absolute top-[145px] right-[548px] cursor-pointer"
              onClick={() => setImagePreview(null)}
            >
              <RxCross2 size={30} />
            </span>
          </div>
        ) : null}
      </div>

      <span className="absolute right-[350px] top-[30px]">
        <button
          className={`${isOpen ? "contents" : "hidden"}`}
          onClick={() => {
            setIsOpen(!isOpen);
            setImagePreview(null);
            setPostText("")
          }}
        >
          <RxCross2 size={30} />{" "}
        </button>
      </span>
    </div>
  );
};

export default CreatePost;
