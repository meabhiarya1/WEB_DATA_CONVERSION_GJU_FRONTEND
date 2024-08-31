import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
  return (
    <div className="sweet-loading flex justify-center items-center w-full h-[100vh] bg-gradient-to-r from-[rgb(240,160,22)] to-teal-200">
      <BeatLoader
        color="teal"
        loading={true}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;
