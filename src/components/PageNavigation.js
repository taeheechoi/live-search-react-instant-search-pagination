import React from 'react';
export default (props) => {
	const {         
            showPrevLink,
            showNextLink,
            handlePrevClick,
            handleNextClick,
            loading,      	      
          } = props;	
    return (
		<div className="nav-link-container">
			<button href="#"
				className={`nav-link  ${ showPrevLink ? 'show' : 'hide'} ${ loading ? 'greyed-out' : '' }`}
				onClick={handlePrevClick}>Prev</button>
			<button href="#"
				className={`nav-link ${showNextLink ? 'show' : 'hide'} ${ loading ? 'greyed-out' : '' }`}
				onClick={handleNextClick}>Next</button>
		</div>
	);
};