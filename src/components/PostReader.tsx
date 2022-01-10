import React, { useEffect, useState } from 'react';

interface IProps {
    slToken: string
    setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

interface IState {
    posts: {
        created_time: string
        from_id: string
        from_name: string
        id: string
        message: string
        type: string
    }[],
    authors: {
        name: string
        post_count: number
    }[]

}

const PostReader: React.FC<IProps> = ({ setisLoggedIn, slToken }) => {

    const [pageNumber, setpageNumber] = useState(1);
    const [allPosts, setAllPosts] = useState<IState["posts"]>([]);
    const [visiblePosts, setVisiblePosts] = useState<IState["posts"]>([]);
    const [authorData, setauthorData] = useState<IState["authors"]>([]);
    const [isChronologicallySorted, setisChronologicallySorted] = useState(true);

    const handleResponse = (data: any) => {
        if ('posts' in data) {
            // successful fetch, set posts to all posts
            // sort posts by date
            const sorted_posts = data.posts.sort((a: any,b: any) => (a.created_time > b.created_time) ? 1 : ((b.created_time > a.created_time) ? -1 : 0))
            setAllPosts(sorted_posts);
            setVisiblePosts(sorted_posts);
            // group posts by author and post count
            let all_authors: any = [];
            data.posts.forEach( (post: any) => {
                all_authors.push(post.from_name)                                
            });
            // alphabetize
            all_authors.sort();
            // create object of author names + count of instances
            let author_occurences = [];
            for (const author of all_authors) {
                const count = all_authors.reduce(function(n: any, val: any) {
                    return n + (val === author);
                }, 0);
                const author_object = {name: author, post_count: count};
                author_occurences.push(author_object);                
            }
            // remove duplicates
            const unique_values = author_occurences.filter((v,i,a)=>a.findIndex(t=>(t.name===v.name))===i);                 
            setauthorData(unique_values);    
            
            
        } else {
            // failed response
            setisLoggedIn(false);
        }            
    }

    useEffect(() => {         
        
        fetch(`https://api.supermetrics.com/assignment/posts?sl_token=${slToken}&page=${pageNumber}`)
            .then(response => response.json())
            .then(data => handleResponse(data.data));         

    }, [slToken, pageNumber])

    // click on author on sidebar, filters posts by author
    const handleAuthorClick = (name: string) => {
        const filtered_posts = allPosts.filter(post => post.from_name.includes(name));
        setVisiblePosts(filtered_posts);                
    }

    // sort posts chronologically if they are not already
    const sortChronologically = () => {
        if (isChronologicallySorted === false) {
            const reversed_posts = [...visiblePosts].reverse();
            setVisiblePosts(reversed_posts);
            setisChronologicallySorted(true);        
        } 
    }

    // reverse order of posts if they are chronologically ordered
    const sortChronologicallyReverse = () => {
        if (isChronologicallySorted) {
            const reversed_posts = [...visiblePosts].reverse();
            setVisiblePosts(reversed_posts);
            setisChronologicallySorted(false);        
        }      
    }

    const renderSideBar = () => {      
        return authorData.map((author) => {            
            return (
                <li key={author.name} onClick={() => handleAuthorClick(author.name)}>
                    <div className='author-wrapper'>
                        <div className='author-name'>
                            {author.name}
                        </div>
                        <div className='author-post-count'>
                            {author.post_count}
                        </div>
                    </div>   
                </li>
            )
        })
    }

    const renderPosts = () => {        
        return visiblePosts.map((post) => {          
            return (
                <li key={post.id}>
                    <div className='post-wrapper'>                  
                        {post.created_time}                   
                        <p>{post.message}</p>
                    </div>
                </li>
            )
        })
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

export default PostReader