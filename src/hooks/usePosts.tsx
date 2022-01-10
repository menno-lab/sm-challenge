import { useEffect, useState } from "react"

interface IUsePosts {
    token: string,
    pagination: number,
}

interface Author {
    name: string
    post_count: number
}

interface Post {
    created_time: string
    from_id: string
    from_name: string
    id: string
    message: string
    type: string
}

interface ApiResponse {
    posts: Post[],
    page: number,
}

interface UniqueAuthors extends Pick<Post, "from_name"> {
    count: number
}


export default function usePosts({token, pagination}: IUsePosts) {
    const [data, setPosts] = useState<Post[]>()
    const [sortedPosts, setSortedPosts] = useState<Post[]>()
    const [error,setError] = useState(null)
    const [authors, setAuthors] = useState<UniqueAuthors[]>()
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
                    fetch(`https://api.supermetrics.com/assignment/posts?sl_token=${token}&page=${pagination}`)
                    .then((response) => response.json())
                    .then(data => {
                        console.log('data', data)
                        postAuthors(data.data.posts)
                        setPosts(data.data.posts)
                        sortPosts(data.data.posts)
                    });
                }catch(err: any){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [pagination, token])

    function sortPosts(data: Post[]): ReadonlyArray<Post> {
        const sorted = data.sort((a: any,b: any) => (a.created_time > b.created_time) ? 1 : ((b.created_time > a.created_time) ? -1 : 0))
        setSortedPosts(sorted)
        return sorted

    }

    function postAuthors(data: Post[]): ReadonlyArray<UniqueAuthors> | undefined {
        if (data) {
            const allAuthors = [...data.map(post => ({
                from_name: post.from_name
            })).sort((a, b) => a.from_name.toLowerCase().localeCompare(b.from_name.toLowerCase()))]

            const countedAuthors = (authorToCount: string) => allAuthors.reduce((n , { from_name } ) => n + (from_name === authorToCount ? 1 : 0), 0);

            const uniqueAuthors = allAuthors.map(author => ({
                from_name: author.from_name,
                count: countedAuthors(author.from_name)
            })).filter((v, i, a) => a.findIndex(t => (t.from_name.toLowerCase() === v.from_name.toLowerCase())) === i);

            setAuthors(uniqueAuthors)
            return uniqueAuthors
        }
        return undefined
    }


    return { data, error, loading, sortedPosts: sortedPosts, postAuthors: authors, setPosts: setSortedPosts }

}