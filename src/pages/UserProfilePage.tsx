import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Users, Heart, MessageSquare, Share2, UserPlus, UserCheck, Flag, Ban } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { topics } = useStore();
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');

  const user = {
    id: userId || '1',
    nickname: '话题达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userId,
    bio: '热爱生活，喜欢分享南北差异趣事',
    location: '北京',
    joinDate: '2024-01',
    followers: 1280,
    following: 356,
    camp: 'north' as const
  };

  const userPosts: any[] = [];

  const likedPosts: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100 flex-1">用户主页</span>
        <button onClick={() => navigate(`/report/user/${userId}`)} className="p-2 hover:bg-slate-700/50 rounded-full" title="举报用户">
          <Flag className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-start gap-4">
          <img src={user.avatar} alt="" className="w-20 h-20 rounded-full border-2 border-slate-600" />
          <div className="flex-1">
            <h2 className="font-bold text-lg text-slate-100">{user.nickname}</h2>
            <p className="text-slate-400 text-sm mt-1">{user.bio}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {user.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {user.joinDate}加入
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-4 py-3 border-t border-slate-700/50">
          <div className="text-center">
            <div className="font-bold text-slate-100">{user.followers}</div>
            <div className="text-xs text-slate-400">粉丝</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-100">{user.following}</div>
            <div className="text-xs text-slate-400">关注</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-100">{userPosts.length}</div>
            <div className="text-xs text-slate-400">帖子</div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
              isFollowing
                ? 'bg-slate-700 text-slate-300'
                : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
            }`}
          >
            {isFollowing ? (
              <><UserCheck className="w-4 h-4" /> 已关注</>
            ) : (
              <><UserPlus className="w-4 h-4" /> 关注</>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/messages?chat=${userId}`)}
            className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-lg font-medium"
          >
            私信
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsBlocked(!isBlocked); showToast(isBlocked ? '已取消屏蔽' : '已屏蔽该用户，将不再看到其内容', isBlocked ? 'info' : 'success'); }}
            className={`py-2 px-3 rounded-lg font-medium flex items-center gap-1 ${isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}
          >
            <Ban className="w-4 h-4" /> {isBlocked ? '已屏蔽' : '屏蔽'}
          </motion.button>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm mt-2">
        <div className="flex border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'posts' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-500'}`}
          >
            帖子
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'likes' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-500'}`}
          >
            赞过
          </button>
        </div>

        <div className="p-4 space-y-4">
          {activeTab === 'posts' ? (
            userPosts.length > 0 ? (
              userPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-700/50 last:border-0 pb-4 last:pb-0 cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <p className="text-sm text-slate-200 line-clamp-2">{post.content}</p>
                  {post.images[0] && (
                    <img src={post.images[0]} alt="" className="w-full h-40 object-cover rounded-lg mt-2" />
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {post.comments.length}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>暂无帖子</p>
              </div>
            )
          ) : (
            likedPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-700/50 last:border-0 pb-4 last:pb-0 cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={post.user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-slate-400">{post.user.nickname}</span>
                </div>
                <p className="text-sm text-slate-200 line-clamp-2">{post.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
