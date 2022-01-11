import React, { ReactElement, useState } from 'react';
import usePosts from '../hooks/usePosts';

interface IProps {
    slToken: string
    setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const PostReader: React.FC<IProps> = ({ setisLoggedIn, slToken }) => {

    const [pageNumber, setpageNumber] = useState(1);    
    const [isChronologicallySorted, setisChronologicallySorted] = useState(true);
    const {error, loading, sortedPosts, postAuthors, setPosts, posts } = usePosts({ token: slToken, page: pageNumber });
    

    // click on author on sidebar, filters posts by author
    const handleAuthorClick = (name: string) => {
        const filtered_posts = posts?.filter(post => post.from_name.includes(name));
        //const filtered_posts = allPosts.filter(post => post.from_name.includes(name));
        setPosts(filtered_posts);
    }

    // sort posts chronologically if they are not already
    const sortChronologically = () => {
        if (isChronologicallySorted === false && sortedPosts) {
            const reversed_posts = [...sortedPosts].reverse();
            setPosts(reversed_posts);
            setisChronologicallySorted(true);
        } 
    }

    // reverse order of posts if they are chronologically ordered
    const sortChronologicallyReverse = () => {
        if (isChronologicallySorted && sortedPosts) {
            const reversed_posts = [...sortedPosts].reverse();
            setPosts(reversed_posts);
            setisChronologicallySorted(false);
        }
    }

    // sidebar with authors + their posts count
    const renderSideBar = () => {
        return postAuthors?.map((author) => {
            return (
                <li key={author.from_name} onClick={() => handleAuthorClick(author.from_name)}>
                    <div className='author-wrapper'>
                        <div className='author-name'>
                            {author.from_name}
                        </div>
                        <div className='author-post-count'>
                            {author.count}
                        </div>
                    </div>
                </li>
            )
        })
    }

    // posts body
    const renderPosts = (): ReactElement[] | undefined => {
        return sortedPosts?.map(post => (
            <li key={post.id}>
                <div className='post-wrapper'>
                    {post.created_time}
                    <p>{post.message}</p>
                </div>
            </li>
        ))
    }

    // determine which component to render in case of loading or error
    function ComponentToRender(): JSX.Element {
        if (loading) {
            return (
                <div>Loading...</div>
            )
        }
        if (error) {
            <div>Error: {error}</div>
        }
        return (
            <div className='posts-page'>
                <div className='top-bar'>
                <button onClick={sortChronologically}>↓</button>
                    <button onClick={sortChronologicallyReverse}>↑</button>               
                </div>
                <div className='sidebar'>
                    <ul>
                        {renderSideBar()}
                    </ul>
                </div>
                <div className='posts-body'>
                    <ul>
                        {renderPosts()}
                    </ul>
                </div>
            </div>
        )
    }

    // return component
    return (
      <ComponentToRender />
    )
}

export default PostReader