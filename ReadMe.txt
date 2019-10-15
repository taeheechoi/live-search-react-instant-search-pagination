1. Create a react app
    
    $ npx create-react-app .

2. Start the app
    $ yarn start

3. Remove unnessary files from src and public folders
    eg. src folder: App.css, App.test.js, logo.svg, serviceWorker.js, 
        public folder: favicon.ico, logoxxx.png, manifest.json, robots.txt

4. Rename index.css to Search.css 

5. Remove all contents in App.js, index.js, Search.css, index.html

6. Create components folder in src folder

7. Add Search.js in the components folder

8. Modify App.js

    import React from 'react';
    import Search from "./components/Search";

    class App extends React.Component{
    render(){
            return(
            <div>
                <Search/>>
            </div>
            );
        }
    }

    export default App;

9. Modify index.html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>App Name</title>
    </head>
    <body>
        <div id="root"></div>

    </body>
    </html>

10. Modify index.js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from "./App";

    ReactDOM.render(<App/>, document.getElementById('root'))

11. Modify Search.js
    import React from 'react';
    import '../Search.css';

    class Search extends React.Component{
        constructor(props){
            super(props);
            this.state ={
                query: '',
                results: {},
                loading: false,
                message: '',
            }
        };

        render(){
            return(
                <div className="container">
                    <label className="search-label" htmlFor="search-input">
                        <input type="text" id="search-input" placeholder="Search..."/>
                        <i className="fa fa-search search-icon"/>
                    </label>
                </div>
            )
        }
    }

    export default Search;

12. Modify Search.css
    /* Search bar */ 

13. Add handleOnInputChange to Search.js
    handleOnInputChange = (event) => {
        const query = event.target.value;
        this.setState({query, loading:true, message:''});
    };

14. Install Axios
    $ npm install axios

15. Add fetchSearchResults() to Search.js
    
    fetchSearchResults = (updatedPageNo = '', query) =>{
        const pageNumber = updatedPageNo ? `&page=${updatedPageNo}`: '';
        const searchUrl = `https://pixabay.com/api/?key=<Your key></Your>&q=${query}${pageNumber}`;	 
        if (this.cancel){
            this.cancel.cancel();
        }
        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {CancelToken: this.cancel.token,})
            .then((res)=>{
                const resultNotFoundMsg = !res.data.hits.length ? 'There are no more search results.': '';
                this.setState({
                    results: res.data.hits,
                    message: resultNotFoundMsg,
                    loading:false,
                });     
            })
            .catch((error) => {
                if (axios.isCancel(error) || error){
                    this.setState({
                        loading: false,
                        message:'Failed to fetch results.',
                    });
                }
            });
    
    };

16. Call fetchSearchResults() on user's query
    handleOnInputChange = (event) => {
        const query = event.target.value;	
        if ( ! query ) {
            this.setState({ query, results: {}, message: '' });
        } else {
            this.setState({ query, loading: true, message: '' }, 
                () => {this.fetchSearchResults(1, query);
            });
        }
    };

17. Add renderSearchResults() to Search.js
    renderSearchResults = () =>{
        const {results} = this.state;      
        if (Object.keys(results).length && results.length){
            return(
                    <div className="results-container">
                    {
                        results.map((result)=>{
                            return (
                                <a key={result.id} href={result.previewURL} className="result-items">
                                    <div className="image-wrapper">
                                        <img className="image" src={result.previewURL} alt={result.user}/>
                                    </div>
                                </a>
                            );
                        })
                    }
                    </div>
            );
        }
    };

18. Update render()
    render(){
        const {query, loading,message} = this.state;
        return(
            <div className="container">
                <h2 className="heading">Live Search: React App</h2>
                <label className="search-label" htmlFor="search-input">
                    <input 
                        type="text" 
                        value={query}
                        id="search-input" 
                        placeholder="Search..."
                        onChange={this.handleOnInputChange}/>
                    <i className="fa fa-search search-icon"/>
                </label>
                {message && <p className="message">{message}</p>}

                <img  src={Loader} className={`search-loading ${loading ? 'show' : 'hide' }`}  alt="loader"/>
                
                {this.renderSearchResults()}
            </div>
        )
    }

19. Update Search.css with /* Results */

Pagination

20. Update constructor
    constructor(props){
        super(props);
        this.state ={
            query: '',
            results: {},
            loading: false,
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPageNo:0,
        }
        this.cancel='';
    };

21. Add getPageCount() to Search.js
    getPagesCount = (total, denominator) => {
        const divisible = total % denominator === 0;
        const valueToBeAdded = divisible ? 0: 1;
        return Math.floor(total/denominator) + valueToBeAdded;
    } 

22. Update fetchSearchResults()
    axios.get(searchUrl, {CancelToken: this.cancel.token,})
        .then((res)=>{
            const total = res.data.total;
            const totalPageCount = this.getPagesCount(total, 20);

            const resultNotFoundMsg = !res.data.hits.length ? 'There are no more search results.': '';
            this.setState({
                results: res.data.hits,
                message: resultNotFoundMsg,
                loading:false,
                totalResults: res.data.total,
                totalPages: totalPageCount,
                currentPageNo: updatedPageNo
            });     
        })

23. Add handlePageClick() to Search.js 
    handlePageClick = (type) => {
        const updatedPageNo = 'prev' === type ? this.state.currentPageNo - 1: this.state.currentPageNo + 1;
        if(!this.state.loading)
        {
            this.setState(
                {loading:true, message:''}, 
                () => {
                    this.fetchSearchResults(updatedPageNo, this.state.query);
            });
        }
    };

24. Update render()
    const {query, loading, message, currentPageNo, totalPages} = this.state;
    const showPrevLink = 1 < currentPageNo; 
    const showNextLink = totalPages > currentPageNo;

25. Add PageNavigation.js to components folder
    import React from 'react';

    export default(props) => {
        const {
            showPrevLink,
            showNextLink,
            handlePrevClick,
            handleNextClick,
            loading,
        } = props;

        return(
            <div className="nav-link-container">
                <button
                    className={`nav-link ${showPrevLink ? 'show': 'hide'} ${loading ? 'greyed-out' : '' }`}
                    onClick = {handlePrevClick}
                >Prev</button>
                <button
                    className={`nav-link ${showNextLink ? 'show': 'hide'} ${loading ? 'greyed-out' : '' }`}
                    onClick = {handleNextClick}
                >Next</button>

            </div>
        )
    }

26. Import PageNavigation and Update Search.js
    import PageNavigation from './PageNavigation';
    <PageNavigation     
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={() => this.handlePageClick('prev')}
        handleNextClick={() => this.handlePageClick('next')}
        loading={loading}
    />
    {this.renderSearchResults()}
    <PageNavigation      
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={() => this.handlePageClick('prev')}
        handleNextClick={() => this.handlePageClick('next')}
        loading={loading}
    />

27. Update Search.css with /* Nav Links */

References:
    https://medium.com/@imranhsayed/live-search-with-react-instant-search-pagination-6acd476af756

    https://github.com/facebook/create-react-app/issues/7183
    npm add @babel/runtime