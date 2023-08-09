import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentDots,
  // Future addition ⬇️
  // faShareFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import Likes from '../Likes/Likes';
import Comments from '../Comments/Comments';
import ModalMenuButton from '../ModalMenuButton/ModalMenuButton';
import Api from '../../ApiHelper';
import './UserPost.scss';

const UserPost = ({ info }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getAllComments = async () => {
      const data = await Api.getComments(info.id);

      setComments(data);
    };

    getAllComments();
  }, []);

  const data = {
    userId: user.id,
    postId: info.id,
    type: 'posts',
  };

  const { username, content, postTime } = info;

  return (
    <div className='UserPost'>
      <div className='UserPost_container'>
        <div className='UserPoset_user'>
          <div className='userInfo'>
            <img src={user.profileImg} alt='' />
            <div className='details'>
              <Link
                to={`/profile/${username}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className='name'>{username}</span>
              </Link>
              <span className='date'>Posted {postTime}</span>
            </div>
          </div>
          <ModalMenuButton className='modal-menu-btn' />
        </div>
        <div className='content'>
          {info.img ? <img src={info.img} alt='' /> : ''}
          <p>{content}</p>
        </div>
        <div className='info'>
          <Likes data={data} />
          <div className='item' onClick={() => setCommentOpen(!commentOpen)}>
            <FontAwesomeIcon icon={faCommentDots} />
            {comments.length !== 1
              ? `${comments.length} Comments`
              : `${comments.length} Comment`}
          </div>
        </div>
        {commentOpen && <Comments comments={comments} postId={info.id} />}
      </div>
    </div>
  );
};

export default UserPost;

/* ⬇️ Future addition ⬇️  Will go next to comments and likes in post*/
/* <div className='item'>
            <FontAwesomeIcon icon={faShareFromSquare} />
            Share
          </div> */
