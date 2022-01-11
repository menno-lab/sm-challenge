import { useEffect, useState } from 'react';

interface IUsePosts {
    token: string,
    page: number,
}

interface Post {
    created_time: string
    from_id: string
    from_name: string
    id: string
    message: string
    type: string
}

interface UniqueAuthors {
    from_name: string
    count: number
}

// this took takes the sl_token & page number and returns posts & authors objects
export default function usePosts({ token, page }: IUsePosts) {
    
    const [posts, setPosts] = useState<Post[]>();
    const [sortedPosts, setSortedPosts] = useState<Post[]>()
    
    const [authors, setAuthors] = useState<UniqueAuthors[]>()

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    // fetch from the assignment endpoint
    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    fetch(`https://api.supermetrics.com/assignment/posts?sl_token=${token}&page=${page}`)
                    .then((response) => response.json())
                    .then(data => {
                        // transform the result to our needed objects                        
                        postAuthors(data.data.posts);
                        setPosts(data.data.posts);
                        sortPosts(data.data.posts);
                    });
                }catch(err: any){
                    setError(err);
                }finally{
                    setLoading(false);
                }
            }
        )()
    }, [page, token])

    // sort posts by creation time
    function sortPosts(data: Post[]): ReadonlyArray<Post> {
        const sorted = data.sort((a: any,b: any) => (a.created_time > b.created_time) ? 1 : ((b.created_time > a.created_time) ? -1 : 0));
        setSortedPosts(sorted);
        return sorted
    }

    // create authors object by grouping posts by post.from_name and get the instances count
    function postAuthors(data: Post[]): ReadonlyArray<UniqueAuthors> | undefined {
        if (data) {
            // create array of objects with each author name and sort alphabetically
            const allAuthors = [...data.map(post => ({
                from_name: post.from_name
            })).sort((a, b) => a.from_name.toLowerCase().localeCompare(b.from_name.toLowerCase()))]
           
            // counts how many times the author occurs in the object            
            const countedAuthors = (authorToCount: string) => allAuthors.reduce((n , { from_name } ) => n + (from_name === authorToCount ? 1 : 0), 0);         
            
            // create object of author name + count and remove duplicates
            const uniqueAuthors = allAuthors.map(author => ({
                from_name: author.from_name,
                count: countedAuthors(author.from_name)
            })).filter((v, i, a) => a.findIndex(t => (t.from_name.toLowerCase() === v.from_name.toLowerCase())) === i);

            setAuthors(uniqueAuthors);            
            return uniqueAuthors
        }
        return undefined
    }
    return { error, loading, posts, sortedPosts: sortedPosts, postAuthors: authors, setPosts: setSortedPosts }
}