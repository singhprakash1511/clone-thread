import React from 'react'
import { useState } from 'react';
import Follower from '../components/Follower';
import Following from '../components/Following';

const FollowersPage = ({user}) => {
    const followers = user?.user.followers;
    const followings = user?.user.following;
    const [active, setActive] = useState('followers');
    console.log(user);
  return (
    <div>
        <div className={`${active === 'followers' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('followers')}>
          {followers.length > 0 ? (
            <div>
              {followers.map((follower) => (
                <Follower key={follower.id}  follower={follower} />
              ))}
            </div>
          ) : ""}
        </div>
        <div className={`${active === 'followings' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('followers')}>
        {followings.length > 0 ? (
            <div>
              {followings.map((following) => (
                <Following key={following.id}  following={following} />
              ))}
            </div>
          ) : ""}
        </div>
    </div>
  )
}

export default FollowersPage
