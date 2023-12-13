import { Models } from 'appwrite'
import React from 'react'
import Loader from './Loader'
import GridPostList from './GridPostList'

const SearchResults = ({ isSearchFetching,
    searchedPosts }: {
        isSearchFetching: boolean,
        searchedPosts: Models.DocumentList<Models.Document> | undefined
    }) => {
    return (
        <div>{isSearchFetching ? <Loader /> :
            (searchedPosts && searchedPosts.documents.length > 0) ? (<GridPostList posts={searchedPosts.documents} />) : <p className='text-light-4 mt-10 text-center w-full'>No results found.</p>}</div>
    )
}

export default SearchResults