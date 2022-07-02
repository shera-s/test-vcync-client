import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const VcyncCard = () => {
  return (
    <>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center font-medium">
              VCYNC-Card APP
            </h1>
            <Link to="/login">
              <button
                type="submit"
                className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VcyncCard;
