import { Link, Navigate, useNavigate } from "react-router-dom"


const Error = () => {

    const navigate = useNavigate()
    const handleGoBack = () => {

       navigate(-1);

    };


    return(
        <div
        style={{ height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}
        className=" error-container">

        <div>
        <img src="/error.png" style={{height:"450px"}} alt="" /> 
        </div>

        <div>
            <h2>The page you were looking for could not be found!</h2>
        </div>

        <div className=" error-btn-container " style={{marginTop:"35px"}} > 

        <Link to="/" style={{margin: "0px 15px"}} >
        <button style={{border:"1px solid #ccc",borderRadius:"9999px", padding:"20px 25px",cursor:"pointer"}} >Back To Home
        </button>
        </Link> 

        <button onClick={handleGoBack} style={{border:"1px solid #ccc",borderRadius:"9999px", padding:"20px 25px",cursor:"pointer"}}  >Go Back Page</button>        


        </div>

        
            
        </div>
    )
}; export default Error