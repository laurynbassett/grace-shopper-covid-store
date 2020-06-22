import React, {useState} from 'react'
import {withRouter} from 'react-router-dom'
import algoliasearch from 'algoliasearch'
import {
  connectStateResults,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox
} from 'react-instantsearch-dom'
import Rating from '@material-ui/lab/Rating'

import secrets from '../../secrets'

const searchClient = algoliasearch(
  secrets.ALGOLIA_CLIENT_ID,
  secrets.ALGOLIA_SEARCH_API_KEY
)

const Hit = ({hit}) => {
  let rating
  if (hit.reviews) {
    rating = hit.reviews.length
      ? +(
          Math.round(
            (hit.reviews.reduce((a, c) => {
              return a + c.rating
            }, 0) /
              hit.reviews.length) *
              2
          ) / 2
        )
      : 0
  }
  return (
    <div className="search-hit">
      <div className="search-hit-image">
        <a href={`/products/${hit.id}`}>
          <img src={hit.imageUrl} alt={hit.name} className="image" />
        </a>
      </div>
      <div className="search-hit-contents">
        <div attribute="name" hit={hit} className="search-hit-name">
          <a href={`/products/${hit.id}`}>{hit.name}</a>
        </div>
        <div className="search-hit-rating">
          <Rating
            name="half-rating-read"
            value={hit.reviews ? rating : ''}
            precision={0.5}
            readOnly
          />{' '}
        </div>
      </div>
    </div>
  )
}

const StateResults = ({searchResults}) => {
  const hasResults = searchResults && searchResults.nbHits !== 0
  const nbHits = searchResults && searchResults.nbHits

  return (
    <div className="search-results">
      <div hidden={!hasResults}>{nbHits} results</div>
      <div hidden={hasResults}>0 results</div>
    </div>
  )
}
const CustomStateResults = connectStateResults(StateResults)

export const Search = props => {
  const [query, setQuery] = useState(``)

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="products_NAME"
      onSearchStateChange={({query}) => setQuery(query)}
    >
      <Header />
      <div className="search-body-top">
        <div>
          Showing results for {props.routeProps.location.pathname.slice(8)}
        </div>
        <CustomStateResults />
      </div>
      <div className="search-body-content">
        <Content />
      </div>
    </InstantSearch>
  )
}

const UnwrappedSearchBar = props => {
  const {handleChange, handleSubmit, query} = props

  return (
    <InstantSearch searchClient={searchClient} indexName="products_NAME">
      <Header
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        query={query}
      />
    </InstantSearch>
  )
}

export const SearchBar = withRouter(UnwrappedSearchBar)

const UnwrappedHeader = props => {
  const {handleChange, handleSubmit, query} = props
  const refinement = props.location.pathname.slice(8)
  return (
    <header className="search-bar-header">
      <SearchBox
        className="search-bar"
        translations={{placeholder: 'Search'}}
        onSubmit={handleSubmit}
        onChange={handleChange}
        defaultRefinement={refinement}
        value={refinement}
      />
    </header>
  )
}

export const Header = withRouter(UnwrappedHeader)

const UnwrappedContent = () => (
  <main>
    <Hits hitComponent={Hit} />
    <div>
      <Pagination showFirst={true} showLast={true} />
    </div>
  </main>
)

export const Content = withRouter(UnwrappedContent)
