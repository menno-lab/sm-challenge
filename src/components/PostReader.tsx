import React, { ReactElement, useState } from 'react';
import usePosts from '../hooks/usePosts';

interface IProps {
    slToken: string
    setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const PostReader: React.FC<IProps> = ({ setisLoggedIn, slToken }) => {          

    const [pageNumber, setpageNumber] = useState(1);    
    const [isChronologicallySorted, setisChronologicallySorted] = useState(true);
    const { error, loading, posts, sortedPosts, filteredAuthors, postAuthors, setPosts, setFilteredAuthors } = usePosts({ token: slToken, page: pageNumber });
    const [authorSearchValue, setAuthorSearchValue] = useState("");
    const [postSearchValue, setPostSearchValue] = useState("");

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
        setFilteredAuthors(filtered_authors);                 
    }

    const handlePostSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostSearchValue(e.target.value);
        const filtered_posts = posts?.filter(item => item.message.toLowerCase().includes(e.target.value));
        setPosts(filtered_posts);                 
    }

    const handleLogout = () => {
        localStorage.removeItem('sl_token');
        setisLoggedIn(false);
        window.location.reload();
    }

    // sidebar with authors + their posts count
    const renderSideBar = () => {
        return filteredAuthors?.map((author) => {
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
                    <span style={{ color: '#11999E' }}>{post.created_time}</span>
                    <p>{post.message}</p>
                </div>
            </li>
        ))
    }

    return (     
        <div className='posts-page'>
            {
                error ? <div>error: {error} <button onClick={handleLogout}>logout</button></div>
                : 
                loading ? <div>Loading...</div>
                :                          
                <div className='page'>
                     <div className='navbar'>
                         <div className='navbar-content'>

                       
                     <div className='navbar-item post-search'>
                            <input className='search-input' type="text" placeholder='Search posts' value={postSearchValue} onChange={handlePostSearch} />                                                       
                        </div>                        
                        <div className='navbar-item page-buttons'>                        
                            <span>Page: {pageNumber}</span>
                            {pageNumber > 1 ? <button onClick={decreasePageNumber}>←</button> : ""}
                            {pageNumber < 10 ? <button onClick={increasePageNumber}>→</button> : ""}                                          
                        </div>
                        <div className='navbar-item sort-buttons'>
                            <span>Sort:</span>
                            <button onClick={sortChronologically}>↓</button>
                            <button onClick={sortChronologicallyReverse}>↑</button>  
                        </div>                        
                        <div className='navbar-item logout-btn'>
                            <button onClick={handleLogout}>logout</button>
                        </div>
                        </div>
                    </div>

                    <div className='page-body'>
                        <div className='sidebar'>                        
                            <div className='authors-section'>
                            <input className='search-input' type="text" placeholder='Search authors' value={authorSearchValue} onChange={handleAuthorSearch} /> 
                                <table>
                                    <tbody>
                                        {renderSideBar()}
                                    </tbody>
                                </table>
                            </div>                                                                  
                        </div>                    
                        <div className='posts-body'>
                            <div className='posts-content'>
                                <ul>
                                    {renderPosts()}
                                </ul>
                            </div>                            
                        </div>
                    </div>
                </div>                
        } 
    </div>      
    )
}

export default PostReader