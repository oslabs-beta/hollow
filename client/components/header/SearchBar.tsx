import { h } from 'https://unpkg.com/preact@10.5.12?module';

// on submit, prevent default

const SearchBar = () => {
    return( 
    <form action="/" method="get">
        <label htmlFor="headerSearch">
            <span className="headerVisuallyHidden">Search Database</span>
        </label>
        <input
            type="text"
            id="headerSearch"
            placeholder="Search Database"
            name="s" 
        />
        <button className = 'headerSearchButton' type="submit">Search</button>
    </form>
    )
}

export default SearchBar