import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaTrash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUSINESS_PROFILE } from "../config/gql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import Resizer from "react-image-file-resizer";
import { GET_PROFILE } from "../config/gql/queries";
import Preloader from "../components/Preloader";

const BuildProfile = () => {
  const user_id = localStorage.getItem("id");

  // const { data, refetch } = useQuery(GET_PROFILE, { variables: { id: user_id }, notifyOnNetworkStatusChange: true, })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socialAccount = useSelector((state) => state.socialMediaAccount);
  const getFormFields = useSelector((state) => state.formFields);
  // console.log(getFormFields);
  const [inputFields, setInputFields] = useState([
    // { extraInfo: "" },
  ]);
  const [file, setFile] = useState();
  const [showError, setShowError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inputFile = useRef(null);

  const [profileType, setProfileType] = useState("Business");

  // console.log(data)
  // console.log(getFormFields)
  var fields = getFormFields.userDetails;
  // var dataFields

  // if(Object.keys(data).length === 1){
  //      dataFields = data.getBPbyId.userDetails[0]
  // }
  const [formDetails, setFormdetails] = useState({
    fname: fields ? fields.fname || "" : "",
    lname: fields ? fields.lname || "" : "",
    company: fields ? fields.company || "" : "",
    mphone: fields ? fields.mphone || "" : "",
    wphone: fields ? fields.wphone || "" : "",
    url: fields ? fields.url || "" : "",
  });

  // console.log(formDetails)

  const [businessProfile, { loading }] = useMutation(BUSINESS_PROFILE);

  // if (loading) return <Preloader />

  // if (loading) return <h1>Loading.....</h1>
  const handleChange = (e) => {
    setFormdetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const addField = (e) => {
    e.preventDefault();
    setInputFields([...inputFields, { extraInfo: "" }]);
  };

  const removeField = (i) => {
    // e.preventDefault()
    const values = [...inputFields];
    values.splice(i, 1);
    setInputFields(values);
  };

  const inputChange = (e, i) => {
    const values = [...inputFields];
    values[i][e.target.name] = e.target.value;
    setInputFields(values);
  };

  const handleSocial = async (e) => {
    e.preventDefault();
    const formFields = {
      user_id: user_id,
      userDetails: formDetails,
      extraInfo: inputFields,
      profile: file,
    };
    dispatch({
      type: "FORMFIELDS",
      payload: formFields,
    });
    navigate("/profile/socialmedia");
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        100,
        100
      );
    });

  const getFiles = async (e) => {
    const size = e.target.files[0].size;

    if (size > 2097152) {
      return setImageError("File is greater than 2MB");
    } else {
      setImageError("");
    }

    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      // console.log(image);
      setFile(image);
      dispatch({
        type: "UPDATEPROFILE",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fname, lname, mphone, wphone } = formDetails;
    try {
      if (!fname || !lname || !mphone || !wphone) {
        return setShowError("Please fill all fields");
      }
      let qrCode = `${window.location.origin}/${user_id}`;

      const userProfile = {
        user_id: user_id,
        userDetails: formDetails,
        extraInfo: inputFields,
        image: getFormFields.profile || file,
        socialData: socialAccount,
        qrCode: qrCode,
      };

      const profile = await businessProfile({
        variables: { profile: userProfile },
      });

      dispatch({
        type: "BUSINESSPROFILE",
        payload: profile.data,
      });
      window.location.href = "/";
      // navigate("/", { replace: true })
    } catch (error) {
      return setShowError(error);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-2 rounded shadow-md text-black w-full">
          <Link to="/">
            <button className="w-full hover:text-green-700 ">
              <FaLongArrowAltLeft size={42} />
            </button>
          </Link>

          <div
            className="w-full inline-flex rounded-full shadow-sm mb-9"
            role="group"
          >
            <button
              onClick={() => setProfileType("Business")}
              type="button"
              className="w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-l-full border border-gray-200 hover:bg-white hover:text-green-700 focus:z-10 focus:bg-white focus:text-green-700"
            >
              Business
            </button>
            <button
              onClick={() => setProfileType("Personal")}
              type="button"
              className="w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-r-full border border-gray-200 hover:bg-white hover:text-green-700 focus:z-10 focus:bg-white focus:text-green-700"
            >
              Personal
            </button>
          </div>

          <div className="text-center">
            <img
              className="h-32 w-32 inline-block object-cover rounded-full"
              src={getFormFields.profile || file || "/user.png"}
              alt="Current profile photo"
            />

            <div className="w-full mt-2 mb-4 text-sky-500 font-medium">
              <button
                type="button"
                className="text-zinc-900"
                onClick={() => inputFile.current.click()}
              >
                Add Photo
              </button>

              <input
                type="file"
                className="hidden"
                ref={inputFile}
                onChange={getFiles}
              />
            </div>
            <p className="mt-2 mb-4 text-red-700 text-center ">{imageError}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="fname"
              placeholder="First Name"
              value={formDetails.fname}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="lname"
              placeholder="Last Name"
              value={formDetails.lname}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="company"
              placeholder="Company"
              value={formDetails.company}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="mphone"
              placeholder="Main Phone"
              value={formDetails.mphone}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="wphone"
              placeholder="Work Phone"
              value={formDetails.wphone}
              onChange={handleChange}
              required
            />

            <input
              type="url"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="url"
              placeholder="Website URL"
              value={formDetails.url}
              onChange={handleChange}
              required
            />

            {inputFields.map((v, i) => {
              return (
                <div className="relative" key={i}>
                  <input
                    type="text"
                    className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
                    placeholder="Extra Info"
                    name="extraInfo"
                    value={inputFields.extraInfo}
                    onChange={(e) => inputChange(e, i)}
                  />

                  <button
                    type="submit"
                    onClick={() => removeField(i)}
                    className="text-green-700 absolute right-2.5 bottom-2.5  focus:outline-none hover:text-zinc-700 text-sm px-4 py-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}

            <button
              onClick={(e) => addField(e)}
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
            >
              Add an extra field
            </button>

            <button
              onClick={(e) => handleSocial(e)}
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
            >
              Add social media account
            </button>

            {loading ? (
              <button
                disabled
                type="submit"
                className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
              >
                Creating....
              </button>
            ) : (
              <button
                type="submit"
                className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
              >
                Create your profile
              </button>
            )}

            <p className="mt-2 mb-4 text-red-700 text-center ">{showError}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildProfile;
