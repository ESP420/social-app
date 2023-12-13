import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce";
import { useGetPosts, useSearchPost } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer";


const Explore = () => {
    const { data: posts, isPending, fetchNextPage, hasNextPage } = useGetPosts()
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce<string>(searchValue, 500)
    const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPost(debouncedValue)
    const shouldShowSearchResults = searchValue !== '';
    const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item.documents.length === 0)
    const { ref, inView } = useInView();
    useEffect(() => {
        return () => {
            if (inView && !searchValue) fetchNextPage()
        }
    }, [inView, searchValue, fetchNextPage])

    return (<>

        {isPending ? (<div className="flex w-full items-center"><Loader /></div>) :
            <div className="explore-container">
                <div className="explore-inner_container">
                    <h2>Search posts</h2>
                    <div className="flex gap-1 w-full rounded-lg bg-dark-4">
                        <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
                        <Input type="text" placeholder="search" className="explore-search" value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)} />
                    </div>
                </div>
                <div className="flex-between w-full max-w-5x1 mt-16 mb-7 flex">
                    <h3 className="body-bold md:h3-bold">Popular Today</h3>
                    <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                        <p className="small-medium md:base-medium text-light-2">All</p>
                        <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
                    </div>

                </div>
                <div className="flex flex-wrap gap-9 w-full max-w-5x1 justify-center items-center">
                    {shouldShowSearchResults ? (
                        <SearchResults
                            isSearchFetching={isSearchFetching}
                            searchedPosts={searchedPosts}
                        />
                    ) : shouldShowPosts ? (
                        <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
                    ) : (
                        posts?.pages.map((item, index) => (
                            <GridPostList key={`page-${index}`} posts={item.documents} />
                        ))
                    )}

                </div>
                {hasNextPage && !searchValue && (
                    <div ref={ref} className="mt-10"><Loader /></div>
                )}
            </div>}
    </>
    )
}
export default Explore