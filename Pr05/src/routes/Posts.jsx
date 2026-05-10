import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useUser from '../hooks/useUser';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [allPostsLoading, setAllPostsLoading] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState('mine');
  const [searchId, setSearchId] = useState(sessionStorage.getItem('posts_searchId') || '');
  const [searchTitle, setSearchTitle] = useState(sessionStorage.getItem('posts_searchTitle') || '');

  const [selectedPost, setSelectedPost] = useState(null);
  const [editBody, setEditBody] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, logout } = useUser();

  useEffect(() => {
    sessionStorage.setItem('posts_searchId', searchId);
    sessionStorage.setItem('posts_searchTitle', searchTitle);
  }, [searchId, searchTitle]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.id.toString() !== userId) { navigate(`/users/${user.id}/posts`); return; }

    const loadPosts = async () => {
      try {
        const cached = sessionStorage.getItem(`posts_data_${user.id}`);
        if (cached) { setPosts(JSON.parse(cached)); setLoading(false); return; }
        const response = await fetch(`http://localhost:3000/posts?userId=${user.id}`);
        const data = await response.json();
        setPosts(data);
        sessionStorage.setItem(`posts_data_${user.id}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [navigate, userId, user]);

  useEffect(() => {
    if (user && !loading) {
      sessionStorage.setItem(`posts_data_${user.id}`, JSON.stringify(posts));
    }
  }, [posts, user, loading]);

  useEffect(() => {
    if (activeTab !== 'all' || allPostsLoaded) return;
    const loadAllPosts = async () => {
      setAllPostsLoading(true);
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch('http://localhost:3000/posts'),
          fetch('http://localhost:3000/users'),
        ]);
        const data = await postsRes.json();
        const users = await usersRes.json();
        setAllPosts(data);
        setUsersMap(Object.fromEntries(users.map(u => [u.id, u.name])));
        setAllPostsLoaded(true);
      } catch (e) {
        console.error('Error fetching all posts:', e);
      } finally {
        setAllPostsLoading(false);
      }
    };
    loadAllPosts();
  }, [activeTab, allPostsLoaded]);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;
    const newPost = {
      userId: isNaN(Number(user.id)) ? user.id : Number(user.id),
      title: newPostTitle,
      body: newPostBody
    };
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      const data = await response.json();
      setPosts([...posts, data]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleUpdatePost = async (post, newBody) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newBody })
      });
      if (response.ok) {
        const updated = { ...post, body: newBody };
        setPosts(posts.map(p => p.id === post.id ? updated : p));
        setSelectedPost(updated);
        setEditBody(newBody);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const applyFilter = (list) => list.filter(p => {
    const matchId = searchId === '' || p.id.toString().includes(searchId);
    const matchTitle = searchTitle === '' || p.title.toLowerCase().includes(searchTitle.toLowerCase());
    return matchId && matchTitle;
  });

  const displayPosts = applyFilter(activeTab === 'mine' ? posts : allPosts);
  const isOwnPost = selectedPost && selectedPost.userId.toString() === user.id.toString();

  const tabStyle = (tab) => ({
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0.4rem 1rem', fontSize: '1rem',
    fontWeight: activeTab === tab ? 700 : 400,
    color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
    marginBottom: '-2px'
  });

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="container min-h-screen">
      <nav className="nav justify-between">
        <div className="flex gap-2 items-center">
          <Link to="/home" style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary)' }}>MyApp</Link>
          <span>/ Posts</span>
        </div>
        <div className="flex gap-2">
          <Link to="/home" className="btn-secondary">Back to Home</Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-danger">Logout</button>
        </div>
      </nav>

      <div className="split-layout">
        {/* Left: Posts list */}
        <div className="card">
          <div className="flex" style={{ borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
            <button style={tabStyle('mine')} onClick={() => { setActiveTab('mine'); setSelectedPost(null); }}>My Posts</button>
            <button style={tabStyle('all')} onClick={() => { setActiveTab('all'); setSelectedPost(null); }}>All Posts</button>
          </div>

          <div className="flex gap-2 mb-4">
            <input type="text" className="input" placeholder="Search by ID..." value={searchId} onChange={e => setSearchId(e.target.value)} style={{ marginBottom: 0, width: '30%' }} />
            <input type="text" className="input" placeholder="Search by Title..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} style={{ marginBottom: 0, flex: 1 }} />
          </div>

          {activeTab === 'mine' && (
            <form onSubmit={handleAddPost} className="flex-col gap-2 mb-6" style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px' }}>
              <input type="text" className="input" placeholder="New post title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} style={{ marginBottom: 0 }} />
              <textarea className="input" placeholder="New post content" value={newPostBody} onChange={e => setNewPostBody(e.target.value)} rows={3} style={{ marginBottom: 0 }} />
              <button type="submit" className="btn">Create Post</button>
            </form>
          )}

          {allPostsLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex-col gap-2">
              {displayPosts.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }} className="text-center">No posts found.</p>
              )}
              {displayPosts.map(post => {
                const isOwn = post.userId.toString() === user.id.toString();
                return (
                  <div
                    key={post.id}
                    onClick={() => { setSelectedPost(post); setEditBody(post.body); }}
                    style={{
                      padding: '1rem',
                      border: selectedPost?.id === post.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedPost?.id === post.id ? 'rgba(99, 102, 241, 0.05)' : 'var(--surface)'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block' }}>
                          #{post.id}{!isOwn ? ` · ${usersMap[post.userId] || 'Unknown'}` : ''}
                        </span>
                        <strong>{post.title}</strong>
                      </div>
                      {isOwn && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                          className="btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto', flexShrink: 0 }}
                        >Delete</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected post detail */}
        {selectedPost && (
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h2 className="title" style={{ fontSize: '1.5rem' }}>{selectedPost.title}</h2>

            {isOwnPost ? (
              <div className="mt-4 mb-4">
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Edit Content:</label>
                <textarea
                  className="input"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={5}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdatePost(selectedPost, editBody)}
                    className="btn"
                    style={{ width: 'auto' }}
                    disabled={editBody === selectedPost.body}
                  >Save</button>
                  <button
                    onClick={() => setEditBody(selectedPost.body)}
                    className="btn-secondary"
                    style={{ width: 'auto' }}
                    disabled={editBody === selectedPost.body}
                  >Discard</button>
                </div>
              </div>
            ) : (
              <p className="mt-4 mb-4" style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{selectedPost.body}</p>
            )}

            <Link
              to={`/users/${selectedPost.userId}/posts/${selectedPost.id}/comments`}
              className="btn-secondary w-full"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              View Comments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
