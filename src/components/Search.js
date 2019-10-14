import React from 'react';
import '../Search.css';
import axios from 'axios';
import Loader from '../loader.gif';
import PageNavigation from './PageNavigation';

class Search extends React.Component{
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

    handleOnInputChange = (event) => {
        const query = event.target.value;	
        if ( ! query ) {
            this.setState(
                { query, results: {}, totalResults: 0, totalPages: 0, currentPageNo: 0, message: '' 
            });
        } else {
            this.setState(
                { query, loading: true, message: '' }, 
                () => {this.fetchSearchResults(1, query);
            });
        }
    };
    
    /* Pagination */
    getPagesCount = (total, denominator) => {
        const divisible = total % denominator === 0;
        const valueToBeAdded = divisible ? 0 : 1;
        return Math.floor(total / denominator) + valueToBeAdded;
    };


    fetchSearchResults = (updatedPageNo = '', query) =>{
        const pageNumber = updatedPageNo ? `&page=${updatedPageNo}`: '';
        const searchUrl = `https://pixabay.com/api/?key=<Your key>&q=${query}${pageNumber}`;	 
        if (this.cancel){
            this.cancel.cancel();
        }
        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {CancelToken: this.cancel.token,})
            .then((res)=>{
                const total = res.data.total;
                const totalPageCount = this.getPagesCount(total, 20);

                const resultNotFoundMsg = !res.data.hits.length ? 'There are no more search results.': '';
                this.setState(
                {
                    results: res.data.hits,
                    message: resultNotFoundMsg,
                    loading: false,
                    totalResults: res.data.total,
                    totalPages: totalPageCount,
                    currentPageNo: updatedPageNo /* Current Page # = the updated page # received in the parameter of fetchSearchResults() */
                });     
            })
            .catch((error) => {
                if (axios.isCancel(error) || error){
                    this.setState(
                    {   
                        loading: false,
                        message:'Failed to fetch results.',
                    });
                }
            });
    
    };

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

    render(){
        const {query, loading, message, currentPageNo, totalPages} = this.state;
        const showPrevLink = 1 < currentPageNo; /* the 1st page = false */
        const showNextLink = totalPages > currentPageNo; /* the last page = false */

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

                <PageNavigation
                    loading={loading}
                    showPrevLink={showPrevLink}
                    showNextLink={showNextLink}
                    handlePrevClick={ () => this.handlePageClick('prev')}
                    handleNextClick={ () => this.handlePageClick('next')}
                />

            </div>
        )
    }
}

export default Search;
