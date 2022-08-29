import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {Cancel,
    PermMedia} from "@material-ui/icons";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [edit,setEdit]=useState(false)
  const [user, setUser] = useState({});
  const [inputEdit,setInputEdit]=useState({})
  const [postTextEdit,setPostTextEdit]=useState(post?.desc)
  const image = useRef()
  const postWords = useRef()
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [editfile, setEditFile] = useState(null);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleEdit = async(e)=>{
    // postWords.current.style.display = "none"
    setEdit(!edit)
    
  }
  const handleSubmitEdit = async(e)=>{
    e.preventDefault();
    const UpdatedPost ={
      userId:currentUser._id,
      desc:postWords.current.value

    }
    
    
    if (editfile) {
      const data = new FormData();
      const fileName = Date.now() + editfile.name;
      data.append("name", fileName);
      data.append("file", editfile);
      UpdatedPost.img = fileName;
      console.log(UpdatedPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err)
      }
    }
    try {
      const res= await axios.put("/posts/"+post._id, UpdatedPost);
      console.log(res.data)
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          { currentUser?._id === post.userId &&
           <div className="postTopRight"
           onClick={handleEdit}>
           <div className="edit" onClick={()=>setEdit(!edit)}>{edit ? "Cancel":"Edit"}</div> <MoreVert />
          </div>
          }
        </div>
        <div className="postCenter">
          {edit ?
          <>
           <textarea className="postTextEdit" placeholder={post?.desc} onChange={(e)=>setPostTextEdit(e.target.value)}  value={postTextEdit} ref={postWords}/> 
           </> 
            :
            <span className="postText" >{post?.desc}</span> 
            }
         { edit ? 
          <>
          {editfile && (
            <div className="shareImgContainer">
              <img className="shareImg" src={URL.createObjectURL(editfile)} alt="" />
              <Cancel className="shareCancelImg" onClick={() => setEditFile(null)} />
            </div>
          )}
          {editfile ?
          <button className="updatePost" type="submit" onClick={handleSubmitEdit}>Update</button>
          :
          <label htmlFor="editfile" className="shareOption">
          <PermMedia htmlColor="tomato" className="shareIcon" />
          <span className="shareOptionText">Photo or Video</span>
          <input
            style={{ display: "none" }}
            type="file"
            id="editfile"
            accept=".png,.jpeg,.jpg"
            onChange={(e) => setEditFile(e.target.files[0])}
          />
        </label>}
          </> :
          <img className="postImg" src={PF + post.img} alt="" ref={image} />
          }
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
