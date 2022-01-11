import React, { ReactElement, useState } from 'react';
import usePosts from '../hooks/usePosts';

interface IProps {
    slToken: string
    setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const PostReader: React.FC<IProps> = ({ setisLoggedIn, slToken }) => {          

    const [pageNumber, setpageNumber] = useState(1);    
    const [isChronologicallySorted, setisChronologicallySorted] = useState(true);
    const {error, loading, posts, sortedPosts, postAuthors, setPosts, setAuthors } = usePosts({ token: slToken, page: pageNumber });

    const [authorSearchValue, setAuthorSearchValue] = useState("");


    // click on author on sidebar, filters posts by author
    const handleAuthorClick = (name: string) => {
        const filtered_posts = posts?.filter(post => post.from_name.includes(name));
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

    const increasePageNumber = () => {
        setpageNumber(pageNumber + 1);
    }

    const decreasePageNumber = () => {
        setpageNumber(pageNumber - 1);
    }

    const handleAuthorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthorSearchValue(e.target.value);
        const filtered_authors = postAuthors?.filter(item => item.from_name.toLowerCase().includes(e.target.value));
        setAuthors(filtered_authors);                 
    }

    const handleLogout = () => {
        localStorage.removeItem('sl_token');
        setisLoggedIn(false);
        window.location.reload();
    }

    // sidebar with authors + their posts count
    const renderSideBar = () => {
        return postAuthors?.map((author) => {
            return (
                <tr className='author-wrapper' key={author.from_name} onClick={() => handleAuthorClick(author.from_name)}>                    
                        <td className='author-name'>
                            {author.from_name}
                        </td>
                        <td className='author-post-count'>
                            {author.count}
                        </td>                    
                </tr>
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
            return (
                <div>Error: {error}</div>
            )
        }        
        return (   
            <div className='posts-page'>
                <div className='top-bar'>                    
                    <div className='page-buttons'>                        
                        <span>Page: {pageNumber}</span>
                        {pageNumber > 1 ? <button onClick={decreasePageNumber}>←</button> : ""}
                        {pageNumber < 10 ? <button onClick={increasePageNumber}>→</button> : ""}                                          
                    </div>
                    <div className='sort-buttons'>
                        <span>Sort:</span>
                        <button onClick={sortChronologically}>↓</button>
                        <button onClick={sortChronologicallyReverse}>↑</button>  
                    </div>
                    <div className='logout-btn'>
                        <button onClick={handleLogout}>logout</button>
                    </div>                           
                </div>
                <div className='page-body'>                    
                    <div className='sidebar'>
                        <div>
                            <input type="text" placeholder='Search' value={authorSearchValue} onChange={handleAuthorSearch} />
                        </div>
                        <table>
                            <tbody>
                                {renderSideBar()}
                            </tbody>
                        </table>                                          
                    </div>
                    <div className='posts-body'>
                        <ul>
                            {renderPosts()}
                        </ul>
                    </div>
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