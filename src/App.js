import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//IMPORTED AXIOS, WHICH ARE USED MAKE QUERY REQUESTS TO CONVERT FUNTIONS INTO JSON FORMAT
import axios from 'axios';

//CREATED CLASS COMPONENT
class App extends Component {
// CREATED CONSTRUCTOR METHOD TO INITIALIZE SOME INFORMATION OF THE STATE USING PROPS
  constructor(props)
   {
     super(props);
     this.state={
       query:'', // THIS IS WHERE WE ARE STORING USER'S QUERY INFORMATION
       results: {}, // THIS IS WHERE WE ARE STORING THE RESULT FROM THE API
       loading: false, // THIS IS WHERE THE DATA FILE IS FETCHED
       message: '' //WE WILL SAVE ERROR MESSAGES IN HERE, JUST IN CASE
     }
     this.cancel = ''; 
   }

    fetchSearchResults = ( updatedPageNo = '', query ) => {
      const pageNumber = updatedPageNo ? `&page=2${updatedPageNo}` : '';
      //CREATED A VARIABLE AND ASSIGNED THE LINK TO THE GITHUB REPOSITORY FROM WHERE THE SEARCH CRITERIA WILL SEARCH THE RESULTS FROM
      const searchUrl = `https://api.github.com/search/repositories?q=${query}${pageNumber}`;
      //TO ENHANCE PERFORMANCE AND TO REDUCE THE UNNECESSARY PROCESSING OF QUERY AS THE USER TYPES ANY CHARACTER, AN IF CONDITIONAL CONSTRUCT IS USED TO CANCEL PREVIOUS REQUEST
      if ( this.cancel ) {
        this.cancel.cancel();
      }
      // AXIOS CREATES A TOKEN 
      this.cancel = axios.CancelToken.source();
      // USED GET REQUEST TO SEARCH FROM THE GITHUB REPOSITORY
      axios.get( searchUrl, {
         cancelToken: this.cancel.token
       } )
         //THE VARIABLE RES IS USED TO CONTAIN THE RESPONSE OF THE QUERY IF THE RESULT IS NOT FOUND
         .then( res => {
            const resultNotFoundMsg = ! res.data.hits.length
                                    ? 'There are no more search results, try new criteria'
                                    : '';
            })
            // THE FOLLOWING CODE  IS TO ADDRESS ERRORS IF ANY
            .catch( error => {
              if ( axios.isCancel(error) || error ) {
                this.setState( {
                  loading: false,
                  message:'Failed to fetch the data. Please check network'
                })
              }
            })

     }
    //CREATED METHOD TO HANDLE THE EVENT AS THE USER TYPES ANYTHING
    handleOnInputChange = (event) => {
      //THIS VARIABLE IS CREATED TO STORE THE QUERY
      const query = event.target.value;
       this.setState( { query: query, 
                        loading: true,
                        //USED CALLBACK FUNCTION FOR THE NEXT SET OF RESULTS
                        message: '' }, () => {
                          this.fetchSearchResults( 1, query );
                        } );
    
    }
    render() {
      const {query} = this.state;
      //USED TO VIEW THE MESSAGE OF THIS.STATE
      console.warn( this.state );
    return (
      //INSIDE RENDER METHOD A DIV ELEMENT IS CREATED WITH A CLASS NAME OF 'CONTAINER'
      <div className="container"> 
        {/* THE INPUT FIELD PROPERTIES ARE DEFINED FOR THE INPUT FIELD BEING TEXT FIELD, */}
         <input type="text" 
                name="query"
                // VALUE WILL CONTAIN THE QUERY   
                value={query}
                // PLACEHOLDER INDICATES THE TYPE OF PARAMETERS TO BE ENTERED IN THE FIELD
                placeholder="Search criteria..."
                // ON CHANGE WILL EXECUTE THE FUNCTION 'HANDLEONINPUTCHANGE' FUNCTION AS THE USER KEYPUNCHES EVERY CHARACTER
                onChange={this.handleOnInputChange} />
         <h1>{this.state.data} </h1>
      </div>
    )
  }
}

export default App;
