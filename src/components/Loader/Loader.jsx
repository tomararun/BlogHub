import "./Loader.css"

const Loader = () => {
  return (
    <div className="loader_container loader_bg">
      <div className="loader_sub_container">
        <span className="loader"></span>
        <p className="loader_text">Please wait...</p>
      </div>
    </div>
  )
}

export default Loader
