const Loading = () => {

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",

  };

   const imgStyle = {
        height: "120px",       
        
  };

    return(

    <div className='loading' style={containerStyle} >
        <img
        src="https://i.postimg.cc/mDWwKMYK/Animation-1746799416245.gif"
        alt="Loading...."
        style={imgStyle}

        
        />
    </div>
    )
}
export default Loading


